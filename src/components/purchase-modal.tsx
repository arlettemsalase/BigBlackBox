"use client"

import { useState } from "react"
import { X, Loader2, CheckCircle2, Wallet } from "lucide-react"
import type { Content } from "@/lib/types"
import { paymentHandler } from "@/lib/blockchain/payment-handler"
import { distributorContract } from "@/lib/blockchain/distributor-contract"
import { useWallet } from "@/lib/wallet-context"
import { Button } from "@/components/ui/button"

interface PurchaseModalProps {
  content: Content
  onClose: () => void
}

export function PurchaseModal({ content, onClose }: PurchaseModalProps) {
  const { address, isConnected, connect } = useWallet()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

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

    try {
      console.log('🛒 Iniciando compra de:', content.title)
      console.log('💰 Precio:', content.price, 'XLM')
      console.log('👤 Creador:', content.creator)
      
      // Usar la dirección del creador desde variables de entorno (testnet)
      // En producción, esto vendría del metadata del contenido
      const creatorAddress = import.meta.env.VITE_CREATOR_PUBLIC_KEY
      
      if (!creatorAddress) {
        throw new Error('Creator address not configured')
      }
      
      console.log('📬 Enviando pago a:', creatorAddress)
      
      // Verificar si el contrato está configurado
      let result
      if (distributorContract.isConfigured()) {
        console.log('🔧 Usando contrato distributor')
        result = await distributorContract.purchaseContent(
          creatorAddress,
          content.price,
          content.id
        )
      } else {
        console.log('💳 Usando pago directo (contrato no configurado)')
        result = await paymentHandler.purchaseContent(
          creatorAddress,
          content.price,
          content.id
        )
      }

      if (result.success) {
        console.log('✅ Compra exitosa!')
        console.log('📝 Hash de transacción:', result.hash)
        setTxHash(result.hash || null)
        setIsSuccess(true)
        
        // Guardar compra en localStorage
        const purchases = JSON.parse(localStorage.getItem('purchases') || '[]')
        purchases.push({
          contentId: content.id,
          purchaseDate: new Date().toISOString(),
          transactionHash: result.hash
        })
        localStorage.setItem('purchases', JSON.stringify(purchases))

        // No cerrar automáticamente - el usuario decide cuándo cerrar
      } else {
        throw new Error(result.error || 'Purchase failed')
      }
    } catch (err: any) {
      console.error('❌ Error en compra:', err)
      setError(err.message || "Purchase failed")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
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
              <span className="text-xl font-bold">{content.price} XLM</span>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {isSuccess ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3 py-4">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <p className="text-lg font-semibold">Purchase Successful!</p>
                {txHash && (
                  <div className="text-center w-full">
                    <p className="text-xs text-muted-foreground mb-2">Transaction Hash:</p>
                    <div className="bg-muted rounded p-2">
                      <p className="text-xs font-mono break-all select-all">{txHash}</p>
                    </div>
                    <a 
                      href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline mt-2 inline-block"
                    >
                      View on Stellar Expert →
                    </a>
                  </div>
                )}
              </div>
              <Button onClick={onClose} className="w-full">
                Close
              </Button>
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
                  `Purchase for ${content.price} XLM`
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
  )
}
