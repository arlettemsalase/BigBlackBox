# BIGBLACKBOX

## 1. Descripción General

**BIGBLACKBOX** es un marketplace de contenido personalizado donde usuarios pueden comprar y vender de manera privada sin exponer datos sensibles. La plataforma utiliza **Zero-Knowledge Proofs** para verificar que el usuario es mayor de edad sin revelar su edad real, **Stellar Network** para pagos rápidos y baratos en USDC/XLM, y **Freighter Wallet** para gestión de identidad descentralizada.

### Problema

Las plataformas actuales obligan a los usuarios a entregar información personal (documentos, datos reales) para verificar su edad o identidad. Esto compromete su privacidad, limita su acceso y deja los contenidos fuera de blockchain, sin propiedad verificable.

### Solución

BIGBLACKBOX permite navegar contenido, solicitar trabajos personalizados, verificar edad con ZK (próximamente) y pagar en XLM/USDC sin revelar datos sensibles. Todo el contenido adquirido queda registrado en la blockchain de Stellar.

---

## 2. ¿Por qué Stellar?

- ✅ **Pagos instantáneos y económicos** - Transacciones en segundos con fees mínimos
- ✅ **Stablecoins confiables** - USDC nativo en la red
- ✅ **Freighter Wallet** - Integración simple y segura
- ✅ **Stellar SDK** - Herramientas robustas para desarrollo
- ✅ **Testnet accesible** - Desarrollo y pruebas sin costo
- ✅ **Ideal para micropagos** - Perfecto para contenido digital

### Tecnologías Stellar Utilizadas

- **Stellar Network** (Testnet)
- **Freighter Wallet** (@stellar/freighter-api 6.0)
- **Stellar SDK** (stellar-sdk 13.3)
- **Horizon API** (Testnet)
- **XLM/USDC** para pagos

---

## 3. Tech Stack

### Frontend
- **Framework**: React 18.2 + TypeScript 5.2
- **Build Tool**: Vite 5.0
- **Routing**: React Router DOM 6.22
- **Styling**: Tailwind CSS 3.4 + tailwind-merge + clsx
- **Icons**: Lucide React 0.363
- **Notifications**: Sonner 1.4
- **Animations**: tailwindcss-animate 1.0

### Blockchain
- **Network**: Stellar Testnet
- **SDK**: stellar-sdk 13.3.0
- **Wallet Integration**: @stellar/freighter-api 6.0.0
- **API**: Horizon Testnet (https://horizon-testnet.stellar.org)
- **Assets**: XLM (native) + USDC (próximamente)

### Estado Actual
- ✅ Frontend completo con UI/UX implementada
- ✅ Integración con Freighter Wallet funcionando
- ✅ Sistema de pagos XLM en Testnet operativo
- ✅ Mock backend para desarrollo rápido
- ⏳ Integración USDC (en progreso)
- ⏳ Zero-Knowledge Proofs (planificado)
- ⏳ Backend Node.js + Express (planificado)

---

## 4. Arquitectura del MVP

```
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐     │
│  │ Connect  │  │ Discover │  │  Detail  │  │Library │     │
│  │   Page   │  │   Page   │  │   Page   │  │  Page  │     │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              STATE MANAGEMENT LAYER                         │
│  ┌─────────────────┐      ┌──────────────────────┐         │
│  │ WalletContext   │◄────►│  Mock Backend API    │         │
│  │ - isConnected   │      │  - purchaseContent() │         │
│  │ - address       │      │  - getOwnedContent() │         │
│  │ - connect()     │      │  - getAllContent()   │         │
│  └─────────────────┘      └──────────────────────┘         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           BLOCKCHAIN INTEGRATION LAYER                      │
│  ┌──────────────────┐      ┌──────────────────────┐        │
│  │ Freighter Wallet │◄────►│  Payment Handler     │        │
│  │ - connect()      │      │  - sendPayment()     │        │
│  │ - signTx()       │      │  - purchaseContent() │        │
│  │ - getPublicKey() │      │  - validatePayment() │        │
│  └──────────────────┘      └──────────────────────┘        │
│           │                          │                      │
│           └──────────┬───────────────┘                      │
│                      ▼                                       │
│           ┌──────────────────────┐                          │
│           │ Transaction Service  │                          │
│           │ - getBalance()       │                          │
│           │ - checkAccount()     │                          │
│           │ - getTransactions()  │                          │
│           └──────────────────────┘                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              STELLAR NETWORK (TESTNET)                      │
│  ┌───────────────────────────────────────────────────────┐ │
│  │         Horizon API (Testnet)                         │ │
│  │  - Account Management                                 │ │
│  │  - XLM Payments                                       │ │
│  │  - Transaction History                                │ │
│  │  - Balance Queries                                    │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                 DATA PERSISTENCE                            │
│  ┌──────────────┐            ┌──────────────┐              │
│  │ LocalStorage │            │  Blockchain  │              │
│  │ - Purchases  │            │ - TX Hashes  │              │
│  │ - Reviews    │            │ - Ownership  │              │
│  │ - KYC Status │            │ - Payments   │              │
│  └──────────────┘            └──────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Estructura del Proyecto

```
BigBlackBox/
├── src/
│   ├── components/          # Componentes React
│   │   ├── content-card.tsx
│   │   ├── freighter-modal.tsx
│   │   ├── kyc-modal.tsx
│   │   ├── purchase-modal.tsx
│   │   └── ui/              # Componentes UI base
│   ├── pages/               # Páginas de la app
│   │   ├── ConnectPage.tsx
│   │   ├── DiscoverPage.tsx
│   │   ├── ContentDetailPage.tsx
│   │   ├── LibraryPage.tsx
│   │   └── LibraryContentPage.tsx
│   ├── lib/                 # Lógica de negocio
│   │   ├── blockchain/      # 🔥 Integración Stellar
│   │   │   └── payment-handler.ts
│   │   ├── wallet/          # 🔥 Freighter Wallet
│   │   │   └── freighter.ts
│   │   ├── services/        # 🔥 Servicios blockchain
│   │   │   └── transactionService.ts
│   │   ├── mock-backend.ts  # Mock para desarrollo
│   │   ├── mock-data.ts     # Datos de prueba
│   │   ├── wallet-context.tsx
│   │   ├── kyc-config.ts
│   │   └── types.ts
│   ├── App.tsx
│   └── main.tsx
├── public/                  # Assets estáticos
├── .env.example            # Variables de entorno
└── package.json
```

---

## 6. Funcionalidades Implementadas

### ✅ Completadas
- **Conexión Freighter Wallet** - Integración completa con @stellar/freighter-api
- **Verificación KYC** - Sistema de verificación de edad +18 (mock)
- **Marketplace de Contenido** - Navegación y descubrimiento de contenido
- **Sistema de Pagos XLM** - Transacciones reales en Stellar Testnet
- **Biblioteca Personal** - Gestión de contenido comprado
- **Validación de Transacciones** - Verificación de cuentas y balances
- **Historial de Transacciones** - Consulta de operaciones en blockchain
- **UI/UX Completa** - Dark theme con diseño moderno
- **Responsive Design** - Mobile-first approach

### ⏳ En Progreso
- **Pagos USDC** - Integración de stablecoin
- **Zero-Knowledge Proofs** - Verificación de edad sin revelar datos
- **Soroban Smart Contracts** - Contratos para ownership

### 📋 Planificado
- **Backend Node.js + Express** - API REST
- **Base de datos Postgres** - Metadatos de contenido
- **Sistema de Reviews** - Calificaciones y comentarios
- **Contenido Multimedia** - Video player, PDF viewer, Live calls

---

## 7. Getting Started

### Prerequisitos
- Node.js 18+
- npm o yarn
- Freighter Wallet instalado en el navegador
- Cuenta Stellar Testnet con fondos (usar Friendbot)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/BBB-Team/bigblackbox.git
cd BigBlackBox

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus claves

# Iniciar servidor de desarrollo
npm run dev
```

### Configuración de Freighter Wallet

1. Instalar extensión Freighter desde [freighter.app](https://freighter.app)
2. Crear o importar wallet
3. Cambiar a **Testnet** en configuración
4. Obtener XLM de prueba: https://laboratory.stellar.org/#account-creator

### Variables de Entorno

```bash
# Stellar Testnet Configuration
VITE_STELLAR_NETWORK=testnet
VITE_HORIZON_URL=https://horizon-testnet.stellar.org

# Creator Wallet (Testnet)
VITE_CREATOR_PUBLIC_KEY=YOUR_STELLAR_PUBLIC_KEY_HERE
VITE_CREATOR_SECRET_KEY=YOUR_STELLAR_SECRET_KEY_HERE
```

---

## 8. Flujo de Usuario

### 1. Onboarding
```
Usuario → Conectar Freighter Wallet → KYC (+18) → Acceso a plataforma
```

### 2. Compra de Contenido
```
Discover → Ver contenido → Detalle → Purchase Modal → 
Freighter Sign → Stellar TX → Confirmación → Biblioteca
```

### 3. Acceso a Contenido
```
Library → Contenido comprado → Viewer → Rating (próximamente)
```

---

## 9. Design System

### Paleta de Colores
- **Background**: Pure Black `#000000`
- **Primary**: Purple `#D866E6`
- **Accent**: Yellow `#FAE60D`
- **Text**: White `#FFFFFF`
- **Secondary Text**: Gray `#A0A0A0`

### Principios de Diseño
- Dark theme obligatorio
- Mobile-first responsive
- Animaciones sutiles
- Feedback visual claro
- Accesibilidad prioritaria

---

## 10. Equipo BBB

- **Andrea Junes** – Backend & Zero-Knowledge
- **Arlette Salal** – Product Manager
- **Eduardo Ruiz** – Backend / Infraestructura
- **Natalia Salvatierra** – Frontend
- **María Eugenia Funes** – UX/UI Marketplace

---

## 11. Estado del Proyecto (Hackathon)

### ✅ Logros (Primeras 48 horas)
- Frontend React completo y funcional
- Integración Freighter Wallet operativa
- Sistema de pagos XLM en Testnet funcionando
- Payment Handler con validaciones completas
- Transaction Service para consultas blockchain
- UI/UX implementada con Tailwind CSS
- Mock backend para desarrollo ágil
- Flujo end-to-end demostrable

### 🎯 Próximos Pasos
- Integración USDC para pagos en stablecoin
- Implementación Zero-Knowledge Proofs (Noir)
- Despliegue de Soroban Smart Contracts
- Backend Express + Postgres
- Sistema de reviews y ratings
- Viewers de contenido multimedia
- Demo final grabada

---

## 12. Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar dev server
npm run build            # Build para producción
npm run preview          # Preview del build

# Linting y formato
npm run lint             # Verificar código

# Testing (próximamente)
npm run test             # Ejecutar tests
```

---

## 13. Recursos

- **Stellar Docs**: https://developers.stellar.org
- **Freighter Wallet**: https://freighter.app
- **Horizon API**: https://horizon-testnet.stellar.org
- **Stellar Laboratory**: https://laboratory.stellar.org
- **Friendbot (Testnet)**: https://laboratory.stellar.org/#account-creator

---

## Licencia

MIT License - Ver LICENSE para más detalles
