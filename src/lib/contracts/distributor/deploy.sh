#!/bin/bash

# Script de deployment para Purchase Distributor Contract
# BigBlackBox - Stellar Testnet

set -e

echo "🚀 Deploying Purchase Distributor Contract to Stellar Testnet"
echo "=============================================================="

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que Soroban CLI esté instalado
if ! command -v soroban &> /dev/null; then
    echo "❌ Soroban CLI no está instalado"
    echo "Instalar con: cargo install --locked soroban-cli"
    exit 1
fi

echo -e "${GREEN}✓${NC} Soroban CLI encontrado"

# Paso 1: Compilar el contrato
echo ""
echo -e "${BLUE}📦 Paso 1: Compilando contrato...${NC}"
cargo build --target wasm32-unknown-unknown --release

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Contrato compilado exitosamente"
else
    echo "❌ Error compilando contrato"
    exit 1
fi

# Paso 2: Optimizar WASM
echo ""
echo -e "${BLUE}⚡ Paso 2: Optimizando WASM...${NC}"
soroban contract optimize \
  --wasm target/wasm32-unknown-unknown/release/purchase_distributor.wasm

echo -e "${GREEN}✓${NC} WASM optimizado"

# Paso 3: Configurar network (si no existe)
echo ""
echo -e "${BLUE}🌐 Paso 3: Configurando Testnet...${NC}"
soroban config network add testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015" \
  2>/dev/null || echo "Network testnet ya existe"

# Paso 4: Verificar identidad
echo ""
echo -e "${BLUE}🔑 Paso 4: Verificando identidad...${NC}"
if ! soroban config identity ls | grep -q "admin"; then
    echo -e "${YELLOW}⚠${NC}  Identidad 'admin' no encontrada"
    echo "Generando nueva identidad..."
    soroban config identity generate admin
fi

ADMIN_ADDRESS=$(soroban config identity address admin)
echo -e "${GREEN}✓${NC} Admin address: $ADMIN_ADDRESS"

# Paso 5: Deploy del contrato
echo ""
echo -e "${BLUE}🚀 Paso 5: Deploying contrato...${NC}"
CONTRACT_ID=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/purchase_distributor.wasm \
  --source admin \
  --network testnet)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Contrato deployado exitosamente!"
    echo ""
    echo "================================================"
    echo -e "${GREEN}CONTRACT_ID:${NC} $CONTRACT_ID"
    echo "================================================"
    echo ""
else
    echo "❌ Error deployando contrato"
    exit 1
fi

# Paso 6: Leer variables de entorno
echo -e "${BLUE}📝 Paso 6: Leyendo configuración...${NC}"

# Buscar archivo .env en la raíz del proyecto
ENV_FILE="../../../.env"

if [ -f "$ENV_FILE" ]; then
    PLATFORM_KEY=$(grep VITE_PLATFORM_PUBLIC_KEY $ENV_FILE | cut -d '=' -f2 | tr -d ' ')
    CREATOR_KEY=$(grep VITE_CREATOR_PUBLIC_KEY $ENV_FILE | cut -d '=' -f2 | tr -d ' ')
    
    if [ -z "$PLATFORM_KEY" ] || [ -z "$CREATOR_KEY" ]; then
        echo -e "${YELLOW}⚠${NC}  Variables de entorno no configuradas en .env"
        echo "Por favor configura:"
        echo "  - VITE_PLATFORM_PUBLIC_KEY"
        echo "  - VITE_CREATOR_PUBLIC_KEY"
        echo ""
        echo "Puedes inicializar el contrato manualmente con:"
        echo ""
        echo "soroban contract invoke \\"
        echo "  --id $CONTRACT_ID \\"
        echo "  --source admin \\"
        echo "  --network testnet \\"
        echo "  -- initialize \\"
        echo "  --admin $ADMIN_ADDRESS \\"
        echo "  --platform_address <PLATFORM_ADDRESS> \\"
        echo "  --creator_address <CREATOR_ADDRESS> \\"
        echo "  --platform_fee_bps 1000"
        exit 0
    fi
    
    echo -e "${GREEN}✓${NC} Platform: $PLATFORM_KEY"
    echo -e "${GREEN}✓${NC} Creator: $CREATOR_KEY"
else
    echo -e "${YELLOW}⚠${NC}  Archivo .env no encontrado"
    echo "Inicializa el contrato manualmente"
    exit 0
fi

# Paso 7: Inicializar el contrato
echo ""
echo -e "${BLUE}⚙️  Paso 7: Inicializando contrato...${NC}"
echo "Fee de plataforma: 10% (1000 basis points)"

soroban contract invoke \
  --id $CONTRACT_ID \
  --source admin \
  --network testnet \
  -- initialize \
  --admin $ADMIN_ADDRESS \
  --platform_address $PLATFORM_KEY \
  --creator_address $CREATOR_KEY \
  --platform_fee_bps 1000

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Contrato inicializado exitosamente!"
else
    echo "❌ Error inicializando contrato"
    exit 1
fi

# Paso 8: Verificar configuración
echo ""
echo -e "${BLUE}🔍 Paso 8: Verificando configuración...${NC}"
soroban contract invoke \
  --id $CONTRACT_ID \
  --source admin \
  --network testnet \
  -- get_config

# Guardar CONTRACT_ID en archivo
echo ""
echo -e "${BLUE}💾 Guardando CONTRACT_ID...${NC}"
echo "CONTRACT_ID=$CONTRACT_ID" > contract-id.txt
echo -e "${GREEN}✓${NC} Guardado en contract-id.txt"

# Resumen final
echo ""
echo "============================================================"
echo -e "${GREEN}✅ DEPLOYMENT COMPLETADO${NC}"
echo "============================================================"
echo ""
echo "Contract ID: $CONTRACT_ID"
echo "Admin: $ADMIN_ADDRESS"
echo "Platform: $PLATFORM_KEY"
echo "Creator: $CREATOR_KEY"
echo "Fee: 10%"
echo ""
echo "Próximos pasos:"
echo "1. Guarda el CONTRACT_ID en tu .env:"
echo "   VITE_CONTRACT_ID=$CONTRACT_ID"
echo ""
echo "2. Actualiza tu payment-handler.ts para usar el contrato"
echo ""
echo "3. Prueba una compra desde tu app"
echo ""
