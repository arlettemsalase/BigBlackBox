// Adaptador de Freighter Wallet para BigBlackBox
// Proporciona funcionalidades de conexión y firma de transacciones

import { isConnected, requestAccess, getNetwork, signTransaction } from '@stellar/freighter-api'

export interface FreighterWalletAdapter {
  isInstalled: () => Promise<boolean>
  connect: () => Promise<string>
  disconnect: () => void
  isConnected: () => Promise<boolean>
  getPublicKey: () => Promise<string | null>
  signTransaction: (xdr: string, networkPassphrase: string) => Promise<string>
}

class FreighterAdapter implements FreighterWalletAdapter {
  private address: string | null = null

  /**
   * Verifica si Freighter está instalado
   */
  async isInstalled(): Promise<boolean> {
    try {
      // Verificar si la API de Freighter está disponible
      if (typeof window === 'undefined') return false
      
      const network = await getNetwork()
      return !!network
    } catch (error) {
      console.log('Freighter no está instalado')
      return false
    }
  }

  /**
   * Conecta con Freighter y obtiene la dirección pública
   */
  async connect(): Promise<string> {
    try {
      // Verificar instalación
      const installed = await this.isInstalled()
      if (!installed) {
        throw new Error('Freighter wallet no está instalado. Por favor instálalo desde https://www.freighter.app/')
      }

      // Solicitar acceso
      const result = await requestAccess()
      
      // requestAccess devuelve un objeto con { address, error }
      if (result.error) {
        throw new Error(result.error)
      }
      
      if (!result.address) {
        throw new Error('No se pudo obtener la clave pública. El usuario rechazó la conexión.')
      }

      this.address = result.address
      console.log('✅ Wallet conectada:', result.address)
      
      return result.address
    } catch (error: any) {
      console.error('❌ Error conectando wallet:', error)
      
      // Mensajes de error más amigables
      if (error.message?.includes('User declined')) {
        throw new Error('Conexión rechazada por el usuario')
      }
      
      throw error
    }
  }

  /**
   * Desconecta la wallet
   */
  disconnect(): void {
    this.address = null
    console.log('🔌 Wallet desconectada')
  }

  /**
   * Verifica si la wallet está conectada
   */
  async isConnected(): Promise<boolean> {
    try {
      const result = await isConnected()
      return result.isConnected || false
    } catch (error) {
      return false
    }
  }

  /**
   * Obtiene la clave pública actual
   */
  async getPublicKey(): Promise<string | null> {
    if (this.address) {
      return this.address
    }

    try {
      const connected = await this.isConnected()
      if (connected) {
        // Intentar obtener la dirección actual
        const result = await requestAccess()
        if (result.address) {
          this.address = result.address
          return result.address
        }
      }
    } catch (error) {
      console.error('Error obteniendo clave pública:', error)
    }

    return null
  }

  /**
   * Firma una transacción con Freighter
   */
  async signTransaction(xdr: string, networkPassphrase: string): Promise<string> {
    try {
      if (!this.address) {
        throw new Error('Wallet no conectada. Por favor conecta tu wallet primero.')
      }

      console.log('📝 Solicitando firma de transacción...')
      
      const signedResult = await signTransaction(xdr, {
        networkPassphrase,
        address: this.address
      })

      if (!signedResult?.signedTxXdr) {
        throw new Error('No se pudo firmar la transacción')
      }

      console.log('✅ Transacción firmada exitosamente')
      return signedResult.signedTxXdr
    } catch (error: any) {
      console.error('❌ Error firmando transacción:', error)
      
      // Mensajes de error más amigables
      if (error.message?.includes('User declined')) {
        throw new Error('Firma rechazada por el usuario')
      }
      
      throw error
    }
  }
}

// Exportar instancia singleton
export const freighterWallet = new FreighterAdapter()

// Utilidades adicionales
export const formatAddress = (address: string): string => {
  if (!address || address.length < 16) return address
  return `${address.slice(0, 8)}...${address.slice(-8)}`
}

export const isValidStellarAddress = (address: string): boolean => {
  if (typeof address !== 'string') return false
  if (!address) return false
  return address.startsWith('G') && address.length === 56
}
