import { isConnected as freighterIsConnected, requestAccess, getNetwork, signTransaction } from "@stellar/freighter-api"

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

  async isInstalled(): Promise<boolean> {
    if (typeof window === "undefined") return false
    try {
      const network = await getNetwork()
      return Boolean(network)
    } catch {
      return false
    }
  }

  async connect(): Promise<string> {
    const installed = await this.isInstalled()
    if (!installed) {
      throw new Error("Freighter wallet no está instalado. Instálalo desde https://www.freighter.app/")
    }

    const result = await requestAccess()

    if (result.error) {
      throw new Error(result.error)
    }

    if (!result.address) {
      throw new Error("No se pudo obtener la clave pública. El usuario rechazó la conexión.")
    }

    this.address = result.address
    return result.address
  }

  disconnect(): void {
    this.address = null
  }

  async isConnected(): Promise<boolean> {
    try {
      const result = await freighterIsConnected()
      return Boolean(result.isConnected)
    } catch {
      return false
    }
  }

  async getPublicKey(): Promise<string | null> {
    if (this.address) return this.address

    try {
      const connected = await this.isConnected()
      if (!connected) return null
      const result = await requestAccess()
      if (result.address) {
        this.address = result.address
        return result.address
      }
    } catch (error) {
      console.error("Error obteniendo clave pública:", error)
    }

    return null
  }

  async signTransaction(xdr: string, networkPassphrase: string): Promise<string> {
    if (!this.address) {
      throw new Error("Wallet no conectada. Conecta tu wallet primero.")
    }

    const signedResult = await signTransaction(xdr, {
      networkPassphrase,
      address: this.address,
    })

    if (!signedResult?.signedTxXdr) {
      throw new Error("No se pudo firmar la transacción")
    }

    return signedResult.signedTxXdr
  }
}

export const freighterWallet = new FreighterAdapter()

export const formatAddress = (address: string): string => {
  if (!address || address.length < 16) return address
  return `${address.slice(0, 8)}...${address.slice(-8)}`
}

export const isValidStellarAddress = (address: string): boolean => {
  if (typeof address !== "string") return false
  if (!address) return false
  return address.startsWith("G") && address.length === 56
}
