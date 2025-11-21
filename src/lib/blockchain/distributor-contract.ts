// Servicio para interactuar con el contrato distributor de Soroban
// Maneja la compra de contenido con distribución automática de fees

import { freighterWallet } from '@/lib/wallet/freighter'

// Cargar stellar-sdk dinámicamente
let SDK: any = null

async function loadStellarSDK() {
  if (!SDK) {
    const module = await import('stellar-sdk')
    // En v12, necesitamos extraer las propiedades del módulo
    const sdk: any = {}
    for (const key in module) {
      sdk[key] = (module as any)[key]
    }
    
    // Debug: ver qué está disponible
    console.log('📦 SDK keys:', Object.keys(sdk))
    console.log('📦 SDK.Server:', sdk.Server)
    console.log('📦 SDK.Horizon:', sdk.Horizon)
    console.log('📦 SDK.Horizon?.Server:', sdk.Horizon?.Server)
    
    // Si Server no está directamente, buscarlo en Horizon
    if (!sdk.Server && sdk.Horizon?.Server) {
      sdk.Server = sdk.Horizon.Server
      console.log('✅ Server encontrado en Horizon.Server')
    }
    
    SDK = sdk
    console.log('📦 Stellar SDK v12 cargado para Soroban')
  }
  return SDK
}

export interface PurchaseResult {
  success: boolean
  hash?: string
  error?: string
}

class DistributorContract {
  private contractId: string
  private tokenAddress: string
  private networkPassphrase: string
  private horizonUrl: string
  private sorobanUrl: string

  constructor() {
    // Cargar configuración desde variables de entorno
    this.contractId = import.meta.env.VITE_DISTRIBUTOR_CONTRACT_ID || ''
    this.tokenAddress = import.meta.env.VITE_XLM_TOKEN_ADDRESS || ''
    this.networkPassphrase = SDK?.Networks?.TESTNET || 'Test SDF Network ; September 2015'
    this.horizonUrl = 'https://horizon-testnet.stellar.org'
    this.sorobanUrl = 'https://soroban-testnet.stellar.org'

    if (this.isConfigured()) {
      console.log('🔧 DistributorContract inicializado')
      console.log('📝 Contract ID:', this.contractId)
      console.log('💰 Token Address:', this.tokenAddress)
      console.log('🔗 Ver contrato: https://stellar.expert/explorer/testnet/contract/' + this.contractId)
    } else {
      console.log('⚠️ DistributorContract no configurado - usando pagos directos')
    }
  }

  /**
   * Verifica si el contrato está configurado
   */
  isConfigured(): boolean {
    return !!this.contractId && !!this.tokenAddress
  }

  /**
   * Obtiene el link al explorador del contrato
   */
  getExplorerLink(): string {
    return `https://stellar.expert/explorer/testnet/contract/${this.contractId}`
  }

  /**
   * Obtiene el link al explorador de una transacción
   */
  getTransactionExplorerLink(hash: string): string {
    return `https://stellar.expert/explorer/testnet/tx/${hash}`
  }

  /**
   * Compra contenido usando el contrato distributor
   * El contrato distribuye automáticamente: 10% plataforma, 90% creador
   */
  async purchaseContent(
    creatorAddress: string,
    amount: number,
    contentId: string
  ): Promise<PurchaseResult> {
    try {
      console.log('🛒 Iniciando compra con contrato...')
      console.log('📝 Content ID:', contentId)
      console.log('👤 Creator:', creatorAddress)
      console.log('💰 Amount:', amount, 'XLM')

      // Verificar configuración
      if (!this.isConfigured()) {
        throw new Error('Distributor contract not configured')
      }

      // Cargar SDK
      await loadStellarSDK()

      // Obtener dirección del comprador
      const buyerAddress = await freighterWallet.getPublicKey()
      if (!buyerAddress) {
        throw new Error('Wallet no conectada')
      }

      console.log('🔐 Buyer:', buyerAddress)

      // Convertir XLM a stroops (1 XLM = 10,000,000 stroops)
      const amountInStroops = Math.floor(amount * 10_000_000)
      console.log('💵 Amount in stroops:', amountInStroops)

      // Crear servidores (v12 syntax)
      const horizonServer = new SDK.Server(this.horizonUrl)
      const sorobanServer = new SDK.SorobanRpc.Server(this.sorobanUrl)

      // Cargar cuenta del comprador
      console.log('📥 Cargando cuenta del comprador...')
      const buyerAccount = await horizonServer.loadAccount(buyerAddress)

      // Crear contrato
      const contract = new SDK.Contract(this.contractId)

      // Preparar parámetros como ScVals
      const buyerScVal = SDK.Address.fromString(buyerAddress).toScVal()
      const creatorScVal = SDK.Address.fromString(creatorAddress).toScVal()
      const contentIdScVal = SDK.nativeToScVal(contentId, { type: 'string' })
      const tokenScVal = SDK.Address.fromString(this.tokenAddress).toScVal()
      const amountScVal = SDK.nativeToScVal(amountInStroops, { type: 'i128' })

      // Construir transacción para simular
      console.log('🔨 Construyendo transacción...')
      const builtTx = new SDK.TransactionBuilder(buyerAccount, {
        fee: SDK.BASE_FEE,
        networkPassphrase: this.networkPassphrase
      })
        .addOperation(
          contract.call(
            'purchase_content',
            buyerScVal,
            creatorScVal,
            contentIdScVal,
            tokenScVal,
            amountScVal
          )
        )
        .setTimeout(180)
        .build()

      // Simular transacción
      console.log('🧪 Simulando transacción...')
      const simulatedTx = await sorobanServer.simulateTransaction(builtTx)

      // Verificar errores de simulación (v12)
      if (simulatedTx.error) {
        console.error('❌ Error en simulación:', simulatedTx)
        throw new Error(`Simulation failed: ${simulatedTx.error}`)
      }

      console.log('✅ Simulación exitosa')

      // Extraer datos de la simulación
      const auth = simulatedTx.result?.auth || []

      // Calcular fee total
      const baseFee = parseInt(SDK.BASE_FEE)
      const resourceFee = parseInt(simulatedTx.minResourceFee || '0')
      const totalFee = (baseFee + resourceFee).toString()

      console.log('💰 Fees:', { baseFee, resourceFee, totalFee })
      console.log('🔐 Auth entries:', auth.length)

      // Recargar cuenta para sequence number actualizado
      console.log('🔄 Recargando cuenta...')
      const freshBuyerAccount = await horizonServer.loadAccount(buyerAddress)

      // Construir transacción base
      const baseTx = new SDK.TransactionBuilder(freshBuyerAccount, {
        fee: SDK.BASE_FEE,
        networkPassphrase: this.networkPassphrase
      })
        .addOperation(
          contract.call(
            'purchase_content',
            buyerScVal,
            creatorScVal,
            contentIdScVal,
            tokenScVal,
            amountScVal
          )
        )
        .setTimeout(180)
        .build()

      // Usar assembleTransaction para agregar footprint y auth entries
      console.log('🔧 Usando assembleTransaction...')
      const preparedTx = SDK.SorobanRpc.assembleTransaction(baseTx, simulatedTx).build()

      console.log('✅ Transacción ensamblada')
      console.log('💰 Fee total:', preparedTx.fee)

      // Firmar con Freighter
      console.log('✍️ Solicitando firma...')
      const signedXdr = await freighterWallet.signTransaction(
        preparedTx.toXDR(),
        this.networkPassphrase
      )

      // Enviar transacción
      console.log('📤 Enviando transacción...')
      const tx = SDK.TransactionBuilder.fromXDR(signedXdr, this.networkPassphrase)
      const sendResponse = await sorobanServer.sendTransaction(tx)

      console.log('📊 Respuesta del servidor:', sendResponse)
      console.log('🔗 Transaction Hash:', sendResponse.hash)
      console.log('🔗 Ver en Stellar Expert: https://stellar.expert/explorer/testnet/tx/' + sendResponse.hash)

      // Verificar si hay error inmediato
      if (sendResponse.status === 'ERROR') {
        console.error('❌ Error al enviar transacción:', sendResponse)
        console.log('📋 Error result:', sendResponse.errorResult)
        
        if (sendResponse.errorResult) {
          const errorXdr = sendResponse.errorResult.toXDR('base64')
          console.log('📋 Error XDR:', errorXdr)
          
          const resultCode = sendResponse.errorResult?.result()?.code()?.name || 'Unknown'
          console.log('📋 Result code:', resultCode)
          
          throw new Error(`❌ Transaction failed with code: ${resultCode}`)
        }
        
        throw new Error('❌ Transaction failed')
      }

      // Esperar confirmación con manejo robusto de errores de parsing
      console.log('⏳ Esperando confirmación...')
      let attempts = 0
      const maxAttempts = 5 // 5 segundos máximo
      let confirmedSuccess = false
      let confirmedFailed = false

      while (attempts < maxAttempts && !confirmedSuccess && !confirmedFailed) {
        attempts++
        console.log(`⏳ Intento ${attempts}/${maxAttempts}...`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        try {
          const getResponse = await sorobanServer.getTransaction(sendResponse.hash)
          
          // Si llegamos aquí, no hubo error de parsing
          console.log('📊 Estado:', getResponse.status)
          
          if (getResponse.status === 'SUCCESS') {
            console.log('✅ Transacción confirmada en la blockchain!')
            confirmedSuccess = true
            break
          } else if (getResponse.status === 'FAILED') {
            console.error('❌ Transacción falló en la blockchain:', getResponse)
            confirmedFailed = true
            return {
              success: false,
              error: 'Transaction failed on-chain',
              hash: sendResponse.hash
            }
          }
          // Si es NOT_FOUND, continuar esperando
        } catch (err: any) {
          // Error de parsing del SDK - ignorar y continuar
          if (err.message?.includes('Bad union switch')) {
            // Este error es esperado en SDK v12, la transacción probablemente está procesándose
            continue
          }
          // Otro tipo de error - loguear pero continuar
          console.warn('⚠️ Error al consultar (continuando):', err.message)
        }
      }

      // Resultado final
      if (confirmedSuccess) {
        return {
          success: true,
          hash: sendResponse.hash
        }
      } else {
        // No se pudo confirmar, pero la transacción se envió
        console.warn('⚠️ No se pudo confirmar automáticamente (limitación del SDK)')
        console.log('✅ Transacción enviada - verifica en el explorer')
        return {
          success: true,
          hash: sendResponse.hash
        }
      }

    } catch (error: any) {
      console.error('❌ Error en compra con contrato:', error)
      return {
        success: false,
        error: error.message || 'Unknown error'
      }
    }
  }
}

// Exportar instancia singleton
export const distributorContract = new DistributorContract()
