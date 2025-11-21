"use client"

import { useState, useEffect } from "react"
import { X, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { freighterWallet } from "@/lib/wallet/freighter"

interface FreighterModalProps {
  onClose: () => void
  onConnect: (address: string) => void
  mode: "connect" | "sign"
  transactionDetails?: {
    amount: string
    recipient: string
    contentTitle: string
  }
}

export function FreighterModal({ onClose, onConnect, mode, transactionDetails }: FreighterModalProps) {
  const [step, setStep] = useState<"initial" | "processing" | "success" | "error">("initial")
  const [address, setAddress] = useState<string>("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (step === "success" && address) {
      setTimeout(() => {
        onConnect(address)
        onClose()
      }, 1000)
    }
  }, [step, address, onConnect, onClose])

  const handleApprove = async () => {
    setStep("processing")
    setError("")
    
    try {
      if (mode === "connect") {
        // Conectar wallet real
        const publicKey = await freighterWallet.connect()
        setAddress(publicKey)
        setStep("success")
      } else {
        // Modo sign (para transacciones)
        setStep("success")
      }
    } catch (err: any) {
      console.error("Error en Freighter:", err)
      setError(err.message || "Error al conectar con Freighter")
      setStep("error")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl bg-[#1a1a2e] shadow-2xl border border-purple-500/20">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-500/20 p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-semibold text-white">Freighter</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 hover:opacity-100 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {step === "initial" && (
            <>
              <h2 className="text-xl font-bold text-white">
                {mode === "connect" ? "Connect to Big Black Box" : "Approve Transaction"}
              </h2>
              
              {mode === "connect" ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-400">
                    This site would like to connect to your Freighter wallet
                  </p>
                  <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-3">
                    <p className="text-xs text-gray-400 mb-1">Waiting for Freighter...</p>
                    <p className="text-sm text-gray-400">Please approve the connection in your Freighter wallet</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Content</span>
                      <span className="text-sm text-white font-medium">{transactionDetails?.contentTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Amount</span>
                      <span className="text-sm text-white font-medium">${transactionDetails?.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Network</span>
                      <span className="text-sm text-white">Stellar Mainnet</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-3">
                    <p className="text-xs text-gray-400 mb-1">From</p>
                    <p className="text-xs text-white font-mono break-all">{address || "Loading..."}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleApprove}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  {mode === "connect" ? "Connect" : "Approve"}
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-purple-500/20 text-white hover:bg-purple-500/10"
                >
                  Reject
                </Button>
              </div>
            </>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="h-16 w-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
              <p className="text-white font-medium">
                {mode === "connect" ? "Connecting..." : "Processing transaction..."}
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-white font-medium">
                {mode === "connect" ? "Connected!" : "Transaction approved!"}
              </p>
              {address && (
                <p className="text-xs text-gray-400 font-mono break-all text-center px-4">
                  {address}
                </p>
              )}
            </div>
          )}

          {step === "error" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-white font-medium">Connection Failed</p>
              <p className="text-sm text-gray-400 text-center px-4">{error}</p>
              <Button
                onClick={() => setStep("initial")}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
