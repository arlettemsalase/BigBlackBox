## Diagnostico de ganar
- Fortalezas: flujo claro de galería/compra/biblioteca; narrativa unificada en home/discover/connect/library; integración preliminar con Freighter (con adaptador limpio y modales); contrato de distribución con pruebas unitarias y eventos; UI diferenciada con Google Fonts y Material Symbols.
- Debilidades y riesgos: falta de pruebas e2e y de compilación Soroban en la repo actual; métricas on-chain no automatizadas todavía (se añadió script pero requiere claves); ausencia de CI para lint/build/wasm; falta de controles de KYC/edad en contrato (solo en frontend), no hay pause/upgrade guard; no hay manejo de errores en el front para fallas de red de Stellar; README genérico; no hay assets de demo/video.
- Puntos de descalificación potencial: sin checklist reproducible para jueces; falta de comandos documentados para construir contratos en wasm32-unknown-unknown; claves de métricas no provistas; ausencia de validación de addresses/amounts en contrato (se valida amount > 0 pero no token/address).
- Oportunidades de diferenciación: demostrar compra 1-click con Freighter firmando y enviando a contrato; mostrar métricas en vivo del script `metrics` y graficarlas; incorporar “WOW” de trazabilidad (event feed) y prueba de edad verificada; roadmap ZK claro para BN254 + RISC Zero.

## Prioridades
- P0 (demo-breaking): conectar Freighter real en front para firmar y enviar tx al contrato; agregar manejo de errores de red/horizon en pantallas de compra; asegurar comandos de build wasm y soroban-cli; garantizar que el contrato valide admin en init (añadido) y eventos con topics útiles (añadido).
- P1 (seguridad): agregar pausa/owner o guard simple al contrato; validar direcciones y montos non-negative; añadir rate limiting para purchase count?; asegurar que la UI no almacene secretos; sanitizar inputs y deshabilitar compras si Freighter no instalado; agregar env.sample completo.
- P2 (polish): añadir métricas UI que lean `metrics-output.json`; screenshots y video script; mejorar README ganador; automatizar CI (typecheck, build, metrics dry-run); traducción consistente EN/ES para pitch.

## Pre-submit checklist
- Demo: `npm run dev`, conectar Freighter, comprar item, ver compra en biblioteca; grabar flujo completo en <3 min.
- Video: guion 3 min (hook-problema-solución-demo-métricas-roadmap-cierre); mostrar UI y transacción en Stellar Expert.
- UX: botones 1 acción = 1 resultado (con loaders y toasts); manejo de errores de red.
- Seguridad: revisar contrato con `soroban build --target wasm32-unknown-unknown`; confirmar `require_auth` en init/admin (listo); falta pause/owner (pendiente).
- Contratos: publicar IDs y red en README; probar `preview_distribution` outputs; validar eventos en `soroban lab`.
- Testnet: script `node scripts/metrics.js` con METRICS_SECRET/PUBLIC en .env; guardar `metrics-output.json`.
- README: incluir tabla de contract IDs, instrucciones, FAQs, métricas.
- Pitch: 30s/1m/3m scripts actualizados (abajo).
- Reproducibilidad: pasos claros para jurado (abajo).

## Auditoria de seguridad (resumen)
- Backend/Contrato: se añadió `admin.require_auth()` en initialize; eventos ahora llevan topics con buyer/content_id/admin; falta módulo pausable/ownable y validaciones de direcciones/token; storage de compras usa persistent (ok) pero count en instance (aceptable). Riesgo: sin chequeo de allowance/transfer fallido explícito (depende de token).
- Frontend: Freighter adapter limpiado (sin caracteres corruptos); KYC solo en localStorage (no enforce on-chain); no hay sanitización de `content_id` en llamada al contrato (mock backend). Recomendación: gatear acciones cuando Freighter ausente y mostrar CTA.
- Claves: no hay secretos en repo; script de métricas espera envs.

## Revisión de contratos Soroban
- Build target: debe compilarse con `soroban build --target wasm32-unknown-unknown` (agregar a CI). 
- Cambios aplicados: `initialize` ahora requiere auth del admin; eventos incluyen topics útiles; fee/address updates emiten evento con admin.
- Pendiente: añadir guard pausable/owner, validación de direcciones y límites de amount/token, errores tipados; exportar tamaños wasm mínimos con `--release --wasm`.

## Revisión frontend
- Flujo demo: home → discover → content → connect → purchase → library mantiene narrativa coherente.
- Integración Freighter: adapter limpio, modales listos; falta wiring de sign/submit real al contrato (mock por ahora). Añadir manejo de errores de Horizon y estado de “Freighter no instalado”.
- UX: ya hay textos “producto listo para jurado”; falta toasts en fallas de compra y skeleton loaders adicionales.

## Integración Freighter
- Adapter reescrito en `src/lib/wallet/freighter.ts` con chequeo de instalación y firma. Falta: uso real de `signTransaction` + envío a Soroban (añadir función en services para construir/submit tx con `stellar-sdk` o `@stellar/stellar-sdk` compatible con Soroban RPC).

## Roadmap ZK (BN254 + RISC Zero)
- Fase 1: generar proof of age off-chain (groth16/BN254) y almacenar verificación hash en contrato; adaptar call `purchase_content` para requerir hash válido.
- Fase 2: integrar verificación RISC Zero para pruebas de “el usuario pagó X y descargó Y” sin revelar buyer; micro-service que produce receipt hash y contrato que lo valida.
- Fase 3: mover verificación a pipeline modular (attestation registry) y exponer en UI como “Zero-knowledge receipt”.

## README ganador (bloques para reemplazar)
- Tabla de contratos: 
  - PurchaseDistributor: `<CONTRACT_ID>` (testnet/mainnet), fee `<X%>`, admin `<G...>`
- Motivos Stellar: fees bajos, finality rápida, Soroban para lógica de distribución, Freighter UX nativa.
- Comandos: `npm install`; `npm run dev`; `npm run typecheck`; `npm run metrics` (requiere METRICS_SECRET/PUBLIC); `soroban build --target wasm32-unknown-unknown` (contrato).
- Métricas on-chain: usar `scripts/metrics.js`, guardar `metrics-output.json`, graficar en UI.
- Screenshots sugeridas: home hero con claims, discover masonry, connect modal Freighter, checkout/purchase modal, library con “Owned”.
- Mini FAQ: ¿Freighter requerido? sí; ¿datos personales? no, solo hash KYC local; ¿red? testnet/mainnet configurable.
- Pitch corto/tagline: “Black Big Box: compra y vende contenido con privacidad y pruebas en Stellar, listo para impresionar a jurados en 3 minutos.”

## Pitch ganador
- 30s: “Black Big Box es la vitrina privada para pagar a creadores vía Stellar. Con Freighter conectas, compras en un clic y recibes la descarga con pruebas on-chain y privacidad. Mostramos propiedad verificable y métricas de fees/latencia en vivo. Roadmap ZK: receipts y verificación de edad sin revelar identidad.”
- 1m: hook (creadores pierden control y privacidad), problema (pagos exponen identidad y no prueban propiedad), solución (UX 1-click sobre Soroban que distribuye automáticamente fee + creador), demo (conectar Freighter, comprar asset, evento en contrato y descarga en biblioteca), métricas (fees bajos y latencia mostrada por script), ZK roadmap (attestations BN254 + receipts RISC Zero), cierre humano (creadores cobran, compradores prueban propiedad sin ceder privacidad).
- Guion video 3m: 1) Hook: “¿Y si pudieras pagar a creadores sin exponer tu wallet?”; 2) Problema: identidad filtrada y pruebas manuales; 3) Solución: Black Big Box en Stellar (mostrar home claims); 4) Demo: conectar Freighter, mostrar modal, comprar item, ver evento y biblioteca owned; 5) Métricas: correr `npm run metrics`, mostrar json/graph; 6) Seguridad: contrato con admin auth y eventos; 7) Roadmap ZK: edad/verificación y receipts; 8) Cierre: invitación a jurados a probar con pasos reproducibles.

## WOW moment (<2h)
- Feed de eventos en vivo: consumir del RPC los eventos `purchase/platform_fee/creator_amount` y mostrarlos en una sidebar; resalta compradores anónimos y fees cobrados. Costo bajo y gran impacto visual.
- Alternativa: Botón “demo automática” que reproduce el flujo con cuentas de testnet y muestra métricas actualizadas en UI.

## Métricas on-chain
- Script agregado `scripts/metrics.js` (usa `stellar-sdk`) para enviar pago mínimo en testnet y guardar latencia/fee en `metrics-output.json`. Requiere `METRICS_SECRET` y `METRICS_PUBLIC`.
- Integrar en UI un gráfico simple leyendo `metrics-output.json` (pendiente).

## CI/CD y calidad
- Scripts disponibles: `npm run typecheck`, `npm run build`, `npm run metrics`. Falta pipeline CI (GitHub Actions) que ejecute typecheck/build/metrics-dry-run y `soroban build`.
- Añadir futuro: detección de secretos (git-secrets), lint (eslint/prettier), empaquetado de wasm en `wasm/`.

## Instrucciones para el jurado
1) `npm install` y `npm run dev`; abrir `http://localhost:5173/`.  
2) Conectar Freighter cuando se solicite; si no lo tienen, usar modo testnet con cuenta de demostración.  
3) Ir a Discover, elegir asset, comprar; ver evento y luego en Library aparece como “Owned”.  
4) Consultar `metrics-output.json` generado con `npm run metrics` (requiere setear METRICS_SECRET/PUBLIC de testnet) para ver latencia y fees.  
5) Contrato Soroban: compilar con `soroban build --target wasm32-unknown-unknown` y revisar eventos `purchase/platform_fee/creator_amount`.  
6) Pitch y guión se encuentran en esta nota; screenshots sugeridas en README (bloques arriba).  

## Update rápido (bugfix flujo de compra)
- Se añadió `creatorAddress` en `Content` y en `mock-data` para eliminar el error “Creator address not configured”.
- `PurchaseModal` ahora usa `content.creatorAddress || VITE_CREATOR_PUBLIC_KEY` y mejora los mensajes de error (requiere wallet conectada).
- Ajusta el valor de `VITE_CREATOR_PUBLIC_KEY` en `.env` si necesitas un address distinto al de ejemplo de testnet.
- El pago ahora intenta `createAccount` automáticamente si el destino no existe (testnet), evitando el bloqueo “La cuenta destino no existe”; si la cuenta ya existe usa `payment` normal.
