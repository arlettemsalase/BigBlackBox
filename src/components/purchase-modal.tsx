"use client"

import { useState } from "react"
import { X, Loader2, CheckCircle2, Wallet } from "lucide-react"
import type { Content } from "@/lib/types"
import { purchaseContent } from "@/lib/mock-backend"
import { useWallet } from "@/lib/wallet-context"
import { Button } from "@/components/ui/button"
import { FreighterModal } from "@/components/freighter-modal"

interface PurchaseModalProps {
  content: Content
  onClose: () => void
  onSuccess: () => void
}

export function PurchaseModal({ content, onClose, onSuccess }: PurchaseModalProps) {
  const { address, isConnected, connect } = useWallet()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [showFreighter, setShowFreighter] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    setError(null)
    
    try {
      await connect()
      setIsConnecting(false)
    } catch (err) {
      setIsConnecting(false)
      setError(err instanceof Error ? err.message : "Connection failed")
    }
  }

  const handlePurchase = async () => {
    if (!address) return

    setIsProcessing(true)
    setError(null)
    setShowFreighter(true)

    // Simulate Freighter transaction signing
    setTimeout(async () => {
      try {
        await purchaseContent(content.id, address)
        setIsProcessing(false)
        setShowFreighter(false)
        setIsSuccess(true)

        setTimeout(() => {
          onSuccess()
        }, 1500)
      } catch (err) {
        setIsProcessing(false)
        setShowFreighter(false)
        setError(err instanceof Error ? err.message : "Purchase failed")
      }
    }, 100)
  }

  return (
    <>
      {showFreighter && (
        <FreighterModal
          mode="sign"
          onClose={() => {
            setShowFreighter(false)
            setIsProcessing(false)
          }}
          onConnect={() => {}}
          transactionDetails={{
            amount: content.price.toString(),
            recipient: "Creator",
            contentTitle: content.title
          }}
        />
      )}
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="relative w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Purchase Content</h2>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">You are about to purchase:</p>
            <p className="font-semibold">{content.title}</p>
            <p className="text-sm text-muted-foreground">by {content.creator}</p>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Price</span>
              <span className="text-xl font-bold">${content.price}</span>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {isSuccess ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="text-lg font-semibold">Purchase Successful!</p>
            </div>
          ) : !isConnected ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <Wallet className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  You need to connect your wallet to purchase content
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="flex-1"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Wallet
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={onClose} disabled={isConnecting}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Purchase for $${content.price}`
                )}
              </Button>
              <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}
