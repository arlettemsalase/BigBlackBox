"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  connect: () => Promise<void>
  disconnect: () => void
  isLoading: boolean
  error: string | null
  showFreighterModal: boolean
  setShowFreighterModal: (show: boolean) => void
  freighterMode: "connect" | "sign"
  setFreighterMode: (mode: "connect" | "sign") => void
  handleFreighterConnect: (address: string) => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFreighterModal, setShowFreighterModal] = useState(false)
  const [freighterMode, setFreighterMode] = useState<"connect" | "sign">("connect")

  useEffect(() => {
    const savedAddress = localStorage.getItem("stellar_address")
    if (savedAddress) {
      setAddress(savedAddress)
      setIsConnected(true)
    }
  }, [])

  const connect = async () => {
    return new Promise<void>((resolve, reject) => {
      setIsLoading(true)
      setError(null)
      setFreighterMode("connect")
      setShowFreighterModal(true)
      
      // Store resolve/reject for later use
      ;(window as any).__walletConnectResolve = resolve
      ;(window as any).__walletConnectReject = reject
    })
  }

  const handleFreighterConnect = (newAddress: string) => {
    setAddress(newAddress)
    setIsConnected(true)
    localStorage.setItem("stellar_address", newAddress)
    setIsLoading(false)
    setShowFreighterModal(false)
    
    if ((window as any).__walletConnectResolve) {
      ;(window as any).__walletConnectResolve()
      delete (window as any).__walletConnectResolve
      delete (window as any).__walletConnectReject
    }
  }

  const disconnect = () => {
    setAddress(null)
    setIsConnected(false)
    localStorage.removeItem("stellar_address")
  }

  return (
    <WalletContext.Provider value={{ 
      isConnected, 
      address, 
      connect, 
      disconnect, 
      isLoading, 
      error,
      showFreighterModal,
      setShowFreighterModal,
      freighterMode,
      setFreighterMode,
      handleFreighterConnect
    }}>
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
