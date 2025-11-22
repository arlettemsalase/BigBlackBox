# Actualizar Comisión de Plataforma

Este script actualiza la comisión de plataforma del contrato distributor de 10% a 5%.

## 📋 Requisitos Previos

1. **Tener la clave secreta del admin** del contrato
2. **Tener XLM en la cuenta admin** para pagar las fees de la transacción

## 🔧 Configuración

### 1. Verificar las variables en `.env`

El script usa las variables que ya tienes configuradas:

```env
VITE_PLATFORM_SECRET_KEY=S...  # Clave secreta de la plataforma (admin del contrato)
VITE_DISTRIBUTOR_CONTRACT_ID=C...  # ID del contrato distributor
```

**⚠️ IMPORTANTE**: 
- `VITE_PLATFORM_SECRET_KEY` debe ser la clave del admin que desplegó el contrato
- Nunca compartas esta clave ni la subas a Git
- El `.env` ya está en `.gitignore`

### 2. Verificar el Contract ID

Asegúrate de que `VITE_DISTRIBUTOR_CONTRACT_ID` esté configurado en tu `.env`:

```env
VITE_DISTRIBUTOR_CONTRACT_ID=C...  # ID del contrato distributor
```

## 🚀 Ejecutar el Script

```bash
node scripts/update-platform-fee.js
```

## 📊 Qué hace el script

1. ✅ Carga la cuenta admin
2. ✅ Conecta al contrato distributor
3. ✅ Llama a la función `update_platform_fee` con `500` (5%)
4. ✅ Simula la transacción
5. ✅ Firma y envía la transacción
6. ✅ Espera confirmación

## 🎯 Resultado Esperado

```
🔧 Actualizando comisión de plataforma...

📋 Configuración:
   Contract ID: C...
   Admin Address: G...
   Nueva comisión: 5%

✅ Cuenta admin cargada
📝 Preparando transacción...
✅ Simulación exitosa
✅ Transacción firmada
📤 Enviando transacción...
✅ Transacción enviada: abc123...
⏳ Esperando confirmación...

🎉 ¡Comisión actualizada exitosamente!
   Nueva comisión: 5%
   Transaction Hash: abc123...
```

## 🔍 Verificar el Cambio

Después de ejecutar el script, puedes verificar que la comisión cambió:

1. **En el frontend**: Haz una compra de prueba y verifica que la comisión sea 5%
2. **Usando Stellar Expert**: Busca la transacción en https://stellar.expert/explorer/testnet
3. **Llamando a `get_config()`**: El campo `platform_fee_bps` debe ser `500`

## ❓ Troubleshooting

### Error: "VITE_PLATFORM_SECRET_KEY no está configurado"
- Verifica que `VITE_PLATFORM_SECRET_KEY` esté en tu `.env`

### Error: "Unauthorized"
- La clave secreta no corresponde al admin del contrato
- Verifica que estás usando la clave correcta

### Error: "Insufficient balance"
- La cuenta admin no tiene suficiente XLM
- Fondea la cuenta desde https://laboratory.stellar.org/#account-creator?network=test

## 🔄 Cambiar a Otra Comisión

Para cambiar a una comisión diferente, edita la línea en el script:

```javascript
const NEW_FEE_BPS = 500; // Cambia este valor
```

**Ejemplos**:
- `250` = 2.5%
- `500` = 5%
- `750` = 7.5%
- `1000` = 10%
- `1500` = 15%

**Máximo**: `10000` (100%)
