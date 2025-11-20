// Manejador de pagos Stellar para BigBlackBox
// Proporciona funcionalidades para enviar pagos XLM

import { freighterWallet } from '@/lib/wallet/freighter'
import { TransactionService } from '@/lib/services/transactionService'

// Cargar stellar-sdk dinámicamente
let StellarSDK: any = null

async function loadStellarSDK() {
  if (!StellarSDK) {
    // @ts-ignore
    const module = await import('stellar-sdk')
    console.log('📦 Módulo stellar-sdk cargado:', module)
    
    // El módulo es un Module object, necesitamos extraer las propiedades
    // Convertir el Module a un objeto plano
    const sdk: any = {}
    for (const key in module) {
      sdk[key] = (module as any)[key]
    }
    
    // Listar todas las claves disponibles
    console.log('📦 Claves disponibles en SDK:', Object.keys(sdk))
    
    // Buscar Server con diferentes nombres
    console.log('📦 SDK.Server:', sdk.Server)
    console.log('📦 SDK.Horizon:', sdk.Horizon)
    console.log('📦 SDK.Horizon?.Server:', sdk.Horizon?.Server)
    
    // Si Server no existe directamente, buscarlo en Horizon
    if (!sdk.Server && sdk.Horizon && sdk.Horizon.Server) {
      sdk.Server = sdk.Horizon.Server
      console.log('✅ Server encontrado en Horizon.Server')
    }
    
    StellarSDK = sdk
    
    console.log('✅ SDK configurado correctamente')
  }
  return StellarSDK
}

export interface PaymentResult {
  success: boolean
  hash?: string
  error?: string
}

export interface PaymentParams {
  destination: string
  amount: number
  memo?: string
}

export class PaymentHandler {
  private server: any
  private networkPassphrase: string
  private useTestnet: boolean

  constructor(useTestnet: boolean = true) {
    this.useTestnet = useTestnet
    this.networkPassphrase = useTestnet 
      ? 'Test SDF Network ; September 2015'  // Networks.TESTNET
      : 'Public Global Stellar Network ; September 2015'  // Networks.PUBLIC
    // El server se inicializará en el primer uso
    this.server = null
  }

  private async ensureInitialized() {
    if (!this.server) {
      const SDK = await loadStellarSDK()
      this.server = new SDK.Server(
        this.useTestnet 
          ? 'https://horizon-testnet.stellar.org'
          : 'https://horizon.stellar.org'
      )
    }
  }

  /**
   * Envía un pago XLM a una dirección
   */
  async sendPayment(params: PaymentParams): Promise<PaymentResult> {
    try {
      const { destination, amount, memo } = params

      // 0. Cargar SDK y asegurar inicialización
      await this.ensureInitialized()
      const SDK = await loadStellarSDK()

      // 1. Validaciones previas
      await this.validatePayment(destination, amount)

      // 2. Obtener dirección del remitente
      const sourceAddress = await freighterWallet.getPublicKey()
      if (!sourceAddress) {
        throw new Error('Wallet no conectada')
      }

      // 3. Cargar cuenta origen
      console.log('📡 Cargando cuenta origen...')
      const sourceAccount = await this.server.loadAccount(sourceAddress)

      // 4. Construir transacción
      console.log('🔨 Construyendo transacción...')
      let transactionBuilder = new SDK.TransactionBuilder(sourceAccount, {
        fee: SDK.BASE_FEE,
        networkPassphrase: this.networkPassphrase
      })
        .addOperation(SDK.Operation.payment({
          destination,
          asset: SDK.Asset.native(),
          amount: amount.toString()
        }))
        .setTimeout(180)

      // Agregar memo si existe
      if (memo) {
        transactionBuilder = transactionBuilder.addMemo(
          SDK.Memo.text(memo)
        )
      }

      const transaction = transactionBuilder.build()

      // 5. Firmar con Freighter
      console.log('✍️ Solicitando firma...')
      const signedXdr = await freighterWallet.signTransaction(
        transaction.toXDR(),
        this.networkPassphrase
      )

      // 6. Enviar a Horizon
      console.log('📤 Enviando transacción...')
      const signedTransaction = SDK.TransactionBuilder.fromXDR(
        signedXdr,
        this.networkPassphrase
      )
      
      const result = await this.server.submitTransaction(signedTransaction)

      console.log('✅ Pago exitoso:', result.hash)
      
      return {
        success: true,
        hash: result.hash
      }

    } catch (error: any) {
      console.error('❌ Error en pago:', error)
      
      return {
        success: false,
        error: this.parseError(error)
      }
    }
  }

  /**
   * Compra contenido (pago al creador)
   * Adaptado para el flujo de BigBlackBox
   */
  async purchaseContent(
    creatorAddress: string,
    price: number,
    contentId: string
  ): Promise<PaymentResult> {
    return this.sendPayment({
      destination: creatorAddress,
      amount: price,
      memo: `BBB:${contentId}` // Memo para identificar la compra
    })
  }

  /**
   * Valida los parámetros del pago
   */
  private async validatePayment(destination: string, amount: number): Promise<void> {
    // Validar dirección
    if (!destination || !destination.startsWith('G') || destination.length !== 56) {
      throw new Error('Dirección de destino inválida')
    }

    // Validar monto
    if (amount <= 0) {
      throw new Error('El monto debe ser mayor a 0')
    }

    // Verificar que la cuenta destino existe
    console.log('🔍 Verificando cuenta destino...')
    const exists = await TransactionService.checkAccountExists(destination)
    if (!exists) {
      throw new Error('La cuenta destino no existe en la blockchain')
    }

    // Verificar fondos suficientes
    const sourceAddress = await freighterWallet.getPublicKey()
    if (sourceAddress) {
      const balance = await TransactionService.getAccountBalance(sourceAddress)
      const balanceNum = parseFloat(balance)
      const fee = 0.00001 // BASE_FEE en XLM (100 stroops)
      const total = amount + fee

      if (balanceNum < total) {
        throw new Error(`Fondos insuficientes. Necesitas ${total} XLM (incluyendo fee)`)
      }
    }
  }

  /**
   * Parsea errores para mensajes amigables
   */
  private parseError(error: any): string {
    if (error.message) {
      // Errores conocidos
      if (error.message.includes('User declined')) {
        return 'Transacción rechazada por el usuario'
      }
      if (error.message.includes('Wallet no conectada')) {
        return 'Por favor conecta tu wallet primero'
      }
      if (error.message.includes('no existe')) {
        return 'La cuenta destino no existe'
      }
      if (error.message.includes('Fondos insuficientes')) {
        return error.message
      }
      
      return error.message
    }

    // Error de Horizon
    if (error.response?.data?.extras?.result_codes) {
      const codes = error.response.data.extras.result_codes
      return `Error de transacción: ${JSON.stringify(codes)}`
    }

    return 'Error desconocido al procesar el pago'
  }

  /**
   * Obtiene el historial de transacciones
   */
  async getTransactionHistory(address: string, limit: number = 10) {
    return TransactionService.getTransactions(address, limit)
  }

  /**
   * Verifica el balance de una cuenta
   */
  async getBalance(address: string): Promise<string> {
    return TransactionService.getAccountBalance(address)
  }
}

// Exportar instancia singleton
export const paymentHandler = new PaymentHandler(true) // true = testnet
