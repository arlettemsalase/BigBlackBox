# Diagrama de Arquitectura BIGBLACKBOX

## Versión Simplificada (Mermaid)

```mermaid
graph TB
    subgraph "FRONTEND"
        A[React App]
        A1[Connect Page]
        A2[Discover Page]
        A3[Content Detail]
        A4[Library Page]
    end

    subgraph "STATE MANAGEMENT"
        B[Wallet Context]
        C[Mock Backend API]
    end

    subgraph "BLOCKCHAIN LAYER"
        D[Freighter Wallet]
        E[Payment Handler]
        F[Transaction Service]
    end

    subgraph "STELLAR NETWORK"
        G[Horizon API Testnet]
        H[XLM/USDC Payments]
    end

    subgraph "DATA"
        I[LocalStorage]
        J[Blockchain Records]
    end

    A --> B
    A --> C
    B --> D
    C --> E
    D --> E
    E --> F
    F --> G
    G --> H
    E --> I
    H --> J

    style A fill:#D866E6,stroke:#FAE60D,stroke-width:3px,color:#000
    style G fill:#FAE60D,stroke:#D866E6,stroke-width:3px,color:#000
    style D fill:#8B5CF6,stroke:#FAE60D,stroke-width:2px,color:#fff
    style E fill:#8B5CF6,stroke:#FAE60D,stroke-width:2px,color:#fff
```

## Versión Horizontal Simplificada

```mermaid
flowchart LR
    A[👤 Usuario] --> B[🎨 Frontend React]
    B --> C[💼 Freighter Wallet]
    C --> D[💳 Payment Handler]
    D --> E[⭐ Stellar Network]
    E --> F[✅ Transacción Confirmada]
    F --> G[📚 Biblioteca Personal]

    style A fill:#D866E6,stroke:#FAE60D,stroke-width:3px
    style E fill:#FAE60D,stroke:#D866E6,stroke-width:3px,color:#000
    style C fill:#8B5CF6,stroke:#fff,stroke-width:2px
```

## Flujo de Compra Simplificado

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant W as Freighter
    participant P as Payment Handler
    participant S as Stellar Network

    U->>F: Selecciona contenido
    F->>U: Muestra precio
    U->>F: Confirma compra
    F->>W: Solicita firma
    W->>U: ¿Aprobar transacción?
    U->>W: Aprueba
    W->>P: Firma transacción
    P->>S: Envía TX a Horizon
    S->>P: TX Hash confirmado
    P->>F: Compra exitosa
    F->>U: Contenido en biblioteca
```

## Capas de la Arquitectura

```mermaid
graph TD
    subgraph "Capa 1: Presentación"
        UI[UI Components<br/>React + Tailwind]
    end

    subgraph "Capa 2: Lógica de Negocio"
        WC[Wallet Context]
        MB[Mock Backend]
    end

    subgraph "Capa 3: Integración Blockchain"
        FW[Freighter Wallet API]
        PH[Payment Handler]
        TS[Transaction Service]
    end

    subgraph "Capa 4: Red Blockchain"
        SN[Stellar Network<br/>Horizon API]
    end

    UI --> WC
    UI --> MB
    WC --> FW
    MB --> PH
    FW --> PH
    PH --> TS
    TS --> SN

    style UI fill:#D866E6,color:#fff
    style SN fill:#FAE60D,color:#000
```

## Stack Tecnológico Visual

```mermaid
mindmap
  root((BIGBLACKBOX))
    Frontend
      React 18.2
      TypeScript 5.2
      Vite 5.0
      Tailwind CSS
      React Router
    Blockchain
      Stellar SDK 13.3
      Freighter API 6.0
      Horizon Testnet
      XLM/USDC
    Estado
      ✅ Wallet conectada
      ✅ Pagos XLM
      ⏳ USDC
      ⏳ ZK Proofs
```

---

## Cómo usar estos diagramas

### Para GitHub/GitLab
Los diagramas Mermaid se renderizan automáticamente en:
- GitHub README.md
- GitLab README.md
- Notion
- Obsidian

### Para presentaciones
1. **Copiar a Mermaid Live Editor**: https://mermaid.live
2. **Exportar como PNG/SVG**
3. **Usar en PowerPoint/Google Slides**

### Para documentación
Puedes insertar estos bloques directamente en tu README.md y se renderizarán automáticamente en plataformas compatibles.

---

## Versión ASCII Art (Para terminales/texto plano)

```
┌─────────────┐
│   USUARIO   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│   FRONTEND (React)      │
│  - Connect Page         │
│  - Discover Page        │
│  - Library Page         │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  WALLET MANAGEMENT      │
│  - Freighter Wallet     │
│  - Wallet Context       │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  PAYMENT PROCESSING     │
│  - Payment Handler      │
│  - Transaction Service  │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  STELLAR NETWORK        │
│  - Horizon API          │
│  - XLM/USDC Payments    │
└─────────────────────────┘
```
