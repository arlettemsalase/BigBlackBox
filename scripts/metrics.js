/**
 * Medición simple de latencia y fees en Stellar testnet.
 * Requiere las variables de entorno:
 * - METRICS_SECRET: clave secreta del emisor (testnet)
 * - METRICS_PUBLIC: clave pública del emisor
 *
 * Ejecuta:
 *   node scripts/metrics.js
 */

const fs = require("fs")
const path = require("path")
const { Keypair, TransactionBuilder, Networks, Operation, Asset, Horizon } = require("stellar-sdk")

const HORIZON_URL = process.env.HORIZON_URL || "https://horizon-testnet.stellar.org"
const OUTPUT = path.join(process.cwd(), "metrics-output.json")

async function main() {
  const start = Date.now()
  const server = new Horizon.Server(HORIZON_URL)
  const secret = process.env.METRICS_SECRET
  const pub = process.env.METRICS_PUBLIC

  if (!secret || !pub) {
    throw new Error("METRICS_SECRET y METRICS_PUBLIC requeridos")
  }

  const keypair = Keypair.fromSecret(secret)

  const account = await server.loadAccount(pub)
  const baseFee = await server.fetchBaseFee()

  const tx = new TransactionBuilder(account, {
    fee: baseFee.toString(),
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.payment({
        destination: pub,
        asset: Asset.native(),
        amount: "0.000001",
      }),
    )
    .setTimeout(30)
    .build()

  tx.sign(keypair)

  const submitStart = Date.now()
  const result = await server.submitTransaction(tx)
  const submitEnd = Date.now()

  const stats = {
    horizon: HORIZON_URL,
    baseFee,
    ledger: result.ledger,
    hash: result.hash,
    timings: {
      totalMs: submitEnd - start,
      submitMs: submitEnd - submitStart,
    },
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(stats, null, 2))
  console.log("Metrics saved to", OUTPUT)
}

main().catch((err) => {
  console.error("Metrics script failed:", err)
  process.exit(1)
})
