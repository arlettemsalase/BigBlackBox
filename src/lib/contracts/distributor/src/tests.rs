#![cfg(test)]

use crate::{PurchaseDistributor, PurchaseDistributorClient};
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_initialize() {
    let env = Env::default();
    let contract_id = env.register_contract(None, PurchaseDistributor);
    let client = PurchaseDistributorClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let platform = Address::generate(&env);
    let creator = Address::generate(&env);

    client.initialize(&admin, &platform, &creator, &1000); // 10% fee

    let config = client.get_config();
    assert_eq!(config.platform_address, platform);
    assert_eq!(config.creator_address, creator);
    assert_eq!(config.platform_fee_bps, 1000);
}

#[test]
fn test_preview_distribution() {
    let env = Env::default();
    let contract_id = env.register_contract(None, PurchaseDistributor);
    let client = PurchaseDistributorClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let platform = Address::generate(&env);
    let creator = Address::generate(&env);

    client.initialize(&admin, &platform, &creator, &1000); // 10% fee

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
    let creator = Address::generate(&env);

    client.initialize(&admin, &platform, &creator, &10001); // > 100%
}

#[test]
fn test_different_fee_percentages() {
    let env = Env::default();
    let contract_id = env.register_contract(None, PurchaseDistributor);
    let client = PurchaseDistributorClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let platform = Address::generate(&env);
    let creator = Address::generate(&env);

    // Test con 5% fee
    client.initialize(&admin, &platform, &creator, &500);

    let (platform_fee, creator_amount) = client.preview_distribution(&1000000);
    assert_eq!(platform_fee, 50000); // 5%
    assert_eq!(creator_amount, 950000); // 95%
}

#[test]
fn test_zero_fee() {
    let env = Env::default();
    let contract_id = env.register_contract(None, PurchaseDistributor);
    let client = PurchaseDistributorClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let platform = Address::generate(&env);
    let creator = Address::generate(&env);

    // Test con 0% fee
    client.initialize(&admin, &platform, &creator, &0);

    let (platform_fee, creator_amount) = client.preview_distribution(&1000000);
    assert_eq!(platform_fee, 0); // 0%
    assert_eq!(creator_amount, 1000000); // 100%
}

#[test]
#[should_panic(expected = "Already initialized")]
fn test_cannot_reinitialize() {
    let env = Env::default();
    let contract_id = env.register_contract(None, PurchaseDistributor);
    let client = PurchaseDistributorClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let platform = Address::generate(&env);
    let creator = Address::generate(&env);

    // Primera inicialización
    client.initialize(&admin, &platform, &creator, &1000);

    // Intentar inicializar de nuevo (debe fallar)
    client.initialize(&admin, &platform, &creator, &1000);
}
