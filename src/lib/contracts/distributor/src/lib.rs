#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, token::TokenClient, Address, Env, String, Vec,
};

/// Configuración del contrato
#[contracttype]
#[derive(Clone)]
pub struct Config {
    pub platform_address: Address,
    pub platform_fee_bps: u32, // Fee en basis points (100 = 1%, 1000 = 10%)
}

/// Registro de compra
#[contracttype]
#[derive(Clone)]
pub struct Purchase {
    pub buyer: Address,
    pub creator: Address,
    pub content_id: String,
    pub total_amount: i128,
    pub platform_fee: i128,
    pub creator_amount: i128,
    pub timestamp: u64,
}

/// Claves de almacenamiento
#[contracttype]
pub enum DataKey {
    Config,
    Admin,
    PurchaseCount,
    Purchase(u64), // purchase_id -> Purchase
}

#[contract]
pub struct PurchaseDistributor;

#[contractimpl]
impl PurchaseDistributor {
    /// Inicializa el contrato con dirección de plataforma y fee
    /// platform_fee_bps: Fee en basis points (1000 = 10%)
    pub fn initialize(
        env: Env,
        admin: Address,
        platform_address: Address,
        platform_fee_bps: u32,
    ) {
        admin.require_auth();
        // Verificar que no esté inicializado
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }

        // Validar fee <= 100%
        if platform_fee_bps > 10000 {
            panic!("Fee cannot exceed 100%");
        }

        // Guardar admin y config
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::PurchaseCount, &0u64);
        
        let config = Config {
            platform_address,
            platform_fee_bps,
        };
        env.storage().instance().set(&DataKey::Config, &config);
    }

    /// Compra contenido con distribución automática (UNA SOLA FIRMA)
    /// 1. Buyer → Platform (monto completo)
    /// 2. Platform → Creator (automático vía allowance)
    /// Requiere que la plataforma haya dado allowance al contrato previamente
    pub fn purchase_content(
        env: Env,
        buyer: Address,
        creator: Address,
        content_id: String,
        token_address: Address,
        amount: i128,
    ) -> Purchase {
        // Solo requiere autorización del buyer
        buyer.require_auth();

        // Validaciones
        if amount <= 0 {
            panic!("Amount must be positive");
        }

        // Obtener configuración
        let config: Config = env
            .storage()
            .instance()
            .get(&DataKey::Config)
            .expect("Not initialized");

        // Calcular distribución
        let platform_fee = (amount * config.platform_fee_bps as i128) / 10000;
        let creator_amount = amount - platform_fee;

        // Cliente del token
        let token = TokenClient::new(&env, &token_address);

        // Transferir fee a plataforma (si > 0)
        if platform_fee > 0 {
            token.transfer(&buyer, &config.platform_address, &platform_fee);
        }

        // Transferir monto al creador
        token.transfer(&buyer, &creator, &creator_amount);

        // Registrar compra
        let purchase = Purchase {
            buyer: buyer.clone(),
            creator: creator.clone(),
            content_id: content_id.clone(),
            total_amount: amount,
            platform_fee,
            creator_amount,
            timestamp: env.ledger().timestamp(),
        };

        // Guardar en storage
        let mut count: u64 = env.storage().instance().get(&DataKey::PurchaseCount).unwrap_or(0);
        env.storage().persistent().set(&DataKey::Purchase(count), &purchase);
        count += 1;
        env.storage().instance().set(&DataKey::PurchaseCount, &count);

        // Emitir eventos
        env.events().publish(("purchase", content_id.clone(), buyer.clone()), amount);
        env.events().publish(("platform_fee", content_id.clone()), platform_fee);
        env.events().publish(("creator_amount", content_id), creator_amount);

        purchase
    }

    /// Distribución genérica (mantiene compatibilidad con versión anterior)
    pub fn distribute(
        env: Env,
        token_address: Address,
        sender: Address,
        recipients: Vec<(Address, i128)>,
    ) {
        sender.require_auth();
        let token = TokenClient::new(&env, &token_address);

        for (recipient, amount) in recipients.iter() {
            if amount > 0 {
                token.transfer(&sender, &recipient, &amount);
                env.events().publish(("distributed", &recipient), amount);
            }
        }
    }

    /// Actualiza el fee de plataforma (solo admin)
    pub fn update_platform_fee(env: Env, admin: Address, new_fee_bps: u32) {
        admin.require_auth();

        let stored_admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("Not initialized");

        if admin != stored_admin {
            panic!("Unauthorized");
        }

        if new_fee_bps > 10000 {
            panic!("Fee cannot exceed 100%");
        }

        let mut config: Config = env
            .storage()
            .instance()
            .get(&DataKey::Config)
            .expect("Not initialized");

        config.platform_fee_bps = new_fee_bps;
        env.storage().instance().set(&DataKey::Config, &config);

        env.events().publish(("fee_updated", admin), new_fee_bps);
    }

    /// Actualiza dirección de plataforma (solo admin)
    pub fn update_platform_address(env: Env, admin: Address, new_address: Address) {
        admin.require_auth();

        let stored_admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("Not initialized");

        if admin != stored_admin {
            panic!("Unauthorized");
        }

        let mut config: Config = env
            .storage()
            .instance()
            .get(&DataKey::Config)
            .expect("Not initialized");

        config.platform_address = new_address.clone();
        env.storage().instance().set(&DataKey::Config, &config);

        env.events().publish(("platform_updated", admin), &new_address);
    }

    /// Obtiene la configuración actual
    pub fn get_config(env: Env) -> Config {
        env.storage()
            .instance()
            .get(&DataKey::Config)
            .expect("Not initialized")
    }

    /// Obtiene una compra por ID
    pub fn get_purchase(env: Env, purchase_id: u64) -> Option<Purchase> {
        env.storage().persistent().get(&DataKey::Purchase(purchase_id))
    }

    /// Obtiene el total de compras registradas
    pub fn get_purchase_count(env: Env) -> u64 {
        env.storage().instance().get(&DataKey::PurchaseCount).unwrap_or(0)
    }

    /// Preview de distribución (sin ejecutar)
    pub fn preview_distribution(env: Env, amount: i128) -> (i128, i128) {
        let config: Config = env
            .storage()
            .instance()
            .get(&DataKey::Config)
            .expect("Not initialized");

        let platform_fee = (amount * config.platform_fee_bps as i128) / 10000;
        let creator_amount = amount - platform_fee;

        (platform_fee, creator_amount)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, PurchaseDistributor);
        let client = PurchaseDistributorClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let platform = Address::generate(&env);

        client.initialize(&admin, &platform, &1000); // 10% fee

        let config = client.get_config();
        assert_eq!(config.platform_address, platform);
        assert_eq!(config.platform_fee_bps, 1000);
    }

    #[test]
    fn test_preview_distribution() {
        let env = Env::default();
        let contract_id = env.register_contract(None, PurchaseDistributor);
        let client = PurchaseDistributorClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let platform = Address::generate(&env);

        client.initialize(&admin, &platform, &1000); // 10% fee

        let (platform_fee, creator_amount) = client.preview_distribution(&1000000);
        assert_eq!(platform_fee, 100000); // 10%
        assert_eq!(creator_amount, 900000); // 90%
    }

    #[test]
    #[should_panic(expected = "Fee cannot exceed 100%")]
    fn test_invalid_fee() {
        let env = Env::default();
        let contract_id = env.register_contract(None, PurchaseDistributor);
        let client = PurchaseDistributorClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let platform = Address::generate(&env);

        client.initialize(&admin, &platform, &10001); // > 100%
    }

    #[test]
    #[should_panic(expected = "Already initialized")]
    fn test_cannot_reinitialize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, PurchaseDistributor);
        let client = PurchaseDistributorClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let platform = Address::generate(&env);

        client.initialize(&admin, &platform, &1000);
        // Intentar inicializar de nuevo debe fallar
        client.initialize(&admin, &platform, &1000);
    }

    #[test]
    fn test_update_platform_fee() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register_contract(None, PurchaseDistributor);
        let client = PurchaseDistributorClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let platform = Address::generate(&env);

        client.initialize(&admin, &platform, &1000); // 10% fee

        // Actualizar fee a 15%
        client.update_platform_fee(&admin, &1500);

        let config = client.get_config();
        assert_eq!(config.platform_fee_bps, 1500);
    }

    #[test]
    fn test_update_platform_address() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register_contract(None, PurchaseDistributor);
        let client = PurchaseDistributorClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let platform = Address::generate(&env);
        let new_platform = Address::generate(&env);

        client.initialize(&admin, &platform, &1000);

        // Actualizar dirección de plataforma
        client.update_platform_address(&admin, &new_platform);

        let config = client.get_config();
        assert_eq!(config.platform_address, new_platform);
    }

    #[test]
    fn test_get_purchase_count() {
        let env = Env::default();
        let contract_id = env.register_contract(None, PurchaseDistributor);
        let client = PurchaseDistributorClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let platform = Address::generate(&env);

        client.initialize(&admin, &platform, &1000);

        // Al inicio debe ser 0
        let count = client.get_purchase_count();
        assert_eq!(count, 0);
    }

    #[test]
    fn test_preview_distribution_different_fees() {
        let env = Env::default();
        let contract_id = env.register_contract(None, PurchaseDistributor);
        let client = PurchaseDistributorClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let platform = Address::generate(&env);

        // Test con 5% fee
        client.initialize(&admin, &platform, &500);
        let (platform_fee, creator_amount) = client.preview_distribution(&1000000);
        assert_eq!(platform_fee, 50000); // 5%
        assert_eq!(creator_amount, 950000); // 95%
    }

    #[test]
    fn test_preview_distribution_zero_fee() {
        let env = Env::default();
        let contract_id = env.register_contract(None, PurchaseDistributor);
        let client = PurchaseDistributorClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let platform = Address::generate(&env);

        // Test con 0% fee
        client.initialize(&admin, &platform, &0);
        let (platform_fee, creator_amount) = client.preview_distribution(&1000000);
        assert_eq!(platform_fee, 0); // 0%
        assert_eq!(creator_amount, 1000000); // 100%
    }
}
