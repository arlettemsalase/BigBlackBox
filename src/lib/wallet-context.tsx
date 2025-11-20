"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { connectWallet as mockConnectWallet } from "./mock-backend"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  connect: () => Promise<void>
  disconnect: () => void
  isLoading: boolean
  error: string | null
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const savedAddress = localStorage.getItem("stellar_address")
    if (savedAddress) {
      setAddress(savedAddress)
      setIsConnected(true)
    }
  }, [])

  const connect = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const mockAddress = await mockConnectWallet()
      setAddress(mockAddress)
      setIsConnected(true)
      localStorage.setItem("stellar_address", mockAddress)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setIsConnected(false)
    localStorage.removeItem("stellar_address")
  }

  return (
    <WalletContext.Provider value={{ isConnected, address, connect, disconnect, isLoading, error }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
