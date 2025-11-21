# Distributor Contract Information

## Contract Details

- **Contract ID**: `CBXVGTFGY7FUYYPNQ6C5AJBZHTD3A4MWUIYMRBCTHBHQRFIWSCX7XWEM`
- **Network**: Stellar Testnet
- **Creator**: `GDEGIGIBXV5P33ZA5O6Y3W5S6HUQAS6YRARVTI37WGMP477Z47F5DWVZ`
- **WASM Hash**: `01ad63a9d896ff929f84643dbcd36732cc15d175df6c177bc1541fe0b52de38e`
- **Created**: November 21, 2025
- **Explorer**: [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CBXVGTFGY7FUYYPNQ6C5AJBZHTD3A4MWUIYMRBCTHBHQRFIWSCX7XWEM)

## Contract Functions

### `initialize`
Inicializa el contrato con la configuración de la plataforma.

**Invocaciones**: 1

### `purchase_content`
Compra contenido con distribución automática de fees.

**Invocaciones**: 2 (exitosas)

**Distribución**:
- 10% → Plataforma
- 90% → Creador

## Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# Distributor Contract
VITE_DISTRIBUTOR_CONTRACT_ID=CBXVGTFGY7FUYYPNQ6C5AJBZHTD3A4MWUIYMRBCTHBHQRFIWSCX7XWEM

# XLM Token (Testnet)
VITE_XLM_TOKEN_ADDRESS=CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC

# Creator Address (for testing)
VITE_CREATOR_PUBLIC_KEY=YOUR_CREATOR_PUBLIC_KEY
```

## Usage

The frontend automatically detects if the contract is configured:

- **With contract**: Purchases use the distributor contract (10% platform fee, 90% to creator)
- **Without contract**: Direct payments to creator (100% to creator)

## Transaction Examples

### Successful Purchase
- **Hash**: `6f1df6954b3b37833c44b253c04614eaaffc14153a3fce05f472d5e82d8727e6`
- **Amount**: 25 XLM
- **Platform Fee**: 2.5 XLM (10%)
- **Creator Amount**: 22.5 XLM (90%)
- **Status**: ✅ SUCCESS
- [View on Explorer](https://stellar.expert/explorer/testnet/tx/6f1df6954b3b37833c44b253c04614eaaffc14153a3fce05f472d5e82d8727e6)

## Contract Source

The contract source code is located at:
```
src/lib/contracts/distributor/src/lib.rs
```

## Testing

To test the contract manually:

```bash
stellar contract invoke \
  --id CBXVGTFGY7FUYYPNQ6C5AJBZHTD3A4MWUIYMRBCTHBHQRFIWSCX7XWEM \
  --source YOUR_SECRET_KEY \
  --network testnet \
  -- \
  purchase_content \
  --buyer YOUR_PUBLIC_KEY \
  --creator CREATOR_PUBLIC_KEY \
  --content_id "CONTENT_ID" \
  --token_address CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC \
  --amount 250000000
```

## Notes

- All amounts are in stroops (1 XLM = 10,000,000 stroops)
- The contract requires the buyer to authorize both transfers with a single signature
- Platform fee is configurable (currently set to 10% = 1000 basis points)
