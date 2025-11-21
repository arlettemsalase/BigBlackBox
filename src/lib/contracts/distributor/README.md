# Purchase Distributor Contract

Contrato Soroban para BigBlackBox que distribuye pagos automáticamente entre creador y plataforma.

## 🎯 Características

- ✅ **Una sola firma del cliente**
- ✅ **Distribución automática** (10% plataforma, 90% creador)
- ✅ **Fee parametrizable**
- ✅ **Registro on-chain de compras**

## 📋 Prerequisitos

```bash
# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Agregar target wasm32
rustup target add wasm32-unknown-unknown

# Instalar Soroban CLI
cargo install --locked soroban-cli
```

## 🚀 Quick Start

### 1. Configurar variables de entorno

Edita `../../../../.env`:

```bash
VITE_PLATFORM_PUBLIC_KEY=GBXXX...
VITE_CREATOR_PUBLIC_KEY=GBYYY...
```

### 2. Deploy automático

```bash
cd src/lib/contracts/distributor
chmod +x deploy.sh
./deploy.sh
```

El script:
- Compila el contrato
- Optimiza el WASM
- Deploya a Testnet
- Inicializa con tus wallets
- Guarda el CONTRACT_ID

### 3. Guardar CONTRACT_ID

Copia el CONTRACT_ID generado a tu `.env`:

```bash
VITE_CONTRACT_ID=CXXX...
```

## 🛠️ Comandos Manuales

### Compilar

```bash
cargo build --target wasm32-unknown-unknown --release
```

### Optimizar

```bash
soroban contract optimize \
  --wasm target/wasm32-unknown-unknown/release/purchase_distributor.wasm
```

### Deploy

```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/purchase_distributor.wasm \
  --source admin \
  --network testnet
```

### Inicializar

```bash
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source admin \
  --network testnet \
  -- initialize \
  --admin <ADMIN_ADDRESS> \
  --platform_address <PLATFORM_KEY> \
  --creator_address <CREATOR_KEY> \
  --platform_fee_bps 1000
```

## 📊 Funciones del Contrato

### `purchase_content`

Compra contenido con una sola firma:

```rust
pub fn purchase_content(
    env: Env,
    buyer: Address,
    content_id: String,
    token_address: Address,
    amount: i128,
) -> Purchase
```

**Ejemplo:**
```bash
soroban contract invoke \
  --id $CONTRACT_ID \
  --source buyer \
  --network testnet \
  -- purchase_content \
  --buyer GBXXX... \
  --content_id "content-123" \
  --token_address <XLM_TOKEN> \
  --amount 1000000000
```

### `preview_distribution`

Calcula distribución sin ejecutar:

```bash
soroban contract invoke \
  --id $CONTRACT_ID \
  --network testnet \
  -- preview_distribution \
  --amount 1000000000
```

### `get_config`

Obtiene configuración actual:

```bash
soroban contract invoke \
  --id $CONTRACT_ID \
  --network testnet \
  -- get_config
```

### `update_platform_fee` (solo admin)

Actualiza el fee:

```bash
soroban contract invoke \
  --id $CONTRACT_ID \
  --source admin \
  --network testnet \
  -- update_platform_fee \
  --admin <ADMIN_ADDRESS> \
  --new_fee_bps 1500  # 15%
```

## 🧪 Testing

```bash
cargo test
```

## 📁 Estructura

```
distributor/
├── Cargo.toml          # Configuración del proyecto
├── deploy.sh           # Script de deployment
├── README.md           # Esta documentación
├── src/
│   └── lib.rs          # Código del contrato
└── target/             # Archivos compilados (generado)
```

## 💡 Integración con TypeScript

Ver ejemplo en `../../../../lib/blockchain/contract-handler.ts` (próximamente)

## 🔒 Seguridad

- Solo el buyer necesita firmar
- Admin protegido para cambios de configuración
- Validaciones de montos y fees
- Eventos para auditoría

## 📝 Notas

- Fee en **basis points**: 1000 = 10%, 100 = 1%
- Montos en **stroops**: 1 XLM = 10,000,000 stroops
- Funciona con **XLM nativo** y cualquier token SAC
