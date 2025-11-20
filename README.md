# BigBlackBoxBIGBLACKBOX

## 1. Descripción general

BIGBLACKBOX es un marketplace de contenido personalizado (por ejemplo, ilustraciones NSFW) donde usuarios pueden comprar y vender de manera privada sin exponer datos sensibles.
La plataforma utiliza Zero-Knowledge Proofs (Noir + Barretenberg) para verificar que el usuario es mayor de edad sin revelar su edad real, Soroban para manejar pagos on-chain y propiedad de contenido, USDC en la red Stellar para pagos rápidos y baratos, y Postgres para almacenar metadatos no sensibles.

## 2. Problema

Las plataformas actuales obligan a los usuarios a entregar información personal como documentos o datos reales para verificar su edad o identidad. Esto compromete su privacidad, limita su acceso y deja los contenidos fuera de blockchain, sin propiedad verificable.

A quién afecta

Creadores de contenido

Consumidores de contenido personalizado

Por qué importa

Miles de personas evitan usar estas plataformas por los riesgos de exposición. La privacidad es un derecho fundamental y la propiedad digital debe ser verificable e interoperable.

## 3. Usuario objetivo y necesidad

Usuario principal:
Consumidores de contenido personalizado (ilustraciones y contenido on-demand).

Necesidad central:
Poder verificar mayoría de edad sin revelar información personal.

Situación actual:
Entregar documentos reales o abandonar la plataforma.

## 4. Solución

BIGBLACKBOX permite navegar contenido, solicitar trabajos personalizados, verificar edad con ZK y pagar en USDC sin revelar datos sensibles.
Todo el contenido adquirido queda asociado a la cuenta del usuario vía Soroban.

Caso de uso

Una usuaria que normalmente paga altas comisiones en Fiverr y entrega datos sensibles puede ahora solicitar ilustraciones privadas, verificar su edad vía ZK y pagar con USDC en segundos.

## 5. ¿Por qué Stellar?

Pagos internacionales instantáneos y muy baratos

Stablecoins confiables (USDC)

Soroban smart contracts con ejecución paralela

Protocol 24 habilita verificación ZK (BN254 + RISC Zero verifier)

Integración simple con Freighter

Excelente elección para privacidad + micropagos + contenido digital

Tecnologías Stellar utilizadas:

Stellar Network (USDC)

Soroban Smart Contracts

Freighter Wallet

Soroswap (opcional)

Noir (circuitos ZK)

Barretenberg (generación de pruebas)

## 6. Funcionalidades clave (hackathon MVP)

Conexión de wallet Freighter

Verificación de edad con Zero-Knowledge (Noir + Barretenberg)

Marketplace Soroban (publicar contenido, comprar contenido, propiedad del comprador)

Base de datos Postgres para metadatos

Pago en USDC testnet

(Opcional): integración Soroswap

## 7. Arquitectura del MVP

Frontend: React + Vite
Backend: Express + Node.js + Noir CLI + Barretenberg + Stellar SDK JS
Smart Contracts: Soroban (Rust)
Base de datos: Postgres
Wallet: Freighter

```

Usuario
↓
Frontend (React + Freighter)
↓
Backend/API (Express, Noir, Postgres)
↓
Soroban Smart Contract
↓
Stellar Network (USDC)
↓
Servicios ZK (Noir + Barretenberg)

```

## 8. Instalación y configuración

1. Clonar el proyecto

```
git clone https://github.com/BBB-Team/bigblackbox.git
cd bigblackbox
```

2. Backend

```
cd backend
npm install
npm start
```

3. Frontend

```
cd frontend
npm install
npm run dev
```

4. Base de datos

```
Postgres local:
CREATE DATABASE bigblackbox;

Variables de entorno:

DATABASE_URL=postgres://user:pass@localhost:5432/bigblackbox
```

5. Soroban Contract

```
   rustup target add wasm32v1-none
   stellar contract build
   stellar contract deploy ...
```

6. Noir

```
   noirup
   nargo check
   nargo execute
```

## 9. Criterios de éxito (hackathon)

El MVP es exitoso si:

Un usuario puede completar todo el flujo: navegar → verificar edad ZK → pagar en USDC → recibir contenido.

El contrato Soroban ejecuta transacciones reales en testnet.

Podemos demostrar generación de prueba Noir conectada con el backend.

Postgres almacena y recupera metadatos correctamente.

## 10. Equipo

BBB Team
Andrea Junes – Backend & ZK
Arlette Salal – Product
Eduardo Ruiz – Backend / Infra
Natalia (…) – Frontend
María Eugenia Funes – UX / Marketplace

## 11. Progreso (primeras 24 horas)

Smart contract Soroban funcionando (registro, arte, compras).

Circuito Noir creado y probado con witness.

Backend Express conectado a Postgres.

UI inicial construida con Freighter.

Flujo end-to-end con datos mock funcionando.

## 12. Próximos pasos

Integración real Noir → Barretenberg → Soroban
Pago funcional USDC testnet
UI/UX final
Demo grabada
Soroswap (opcional)
