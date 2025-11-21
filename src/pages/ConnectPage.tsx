"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/lib/wallet-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ConnectPage() {
  const navigate = useNavigate()
  const { isConnected, connect, isLoading, error } = useWallet()
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if (isConnected) {
      navigate("/discover")
    }
  }, [isConnected, navigate])

  const handleConnect = async () => {
    setShowError(false)
    try {
      await connect()
    } catch (err) {
      setShowError(true)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex justify-center">
          <img 
            src="/logo/logo_blanco.png" 
            alt="Black Big Box" 
            className="h-20 w-20 object-contain"
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Pay creators privately with Stellar</h1>
          <p className="text-lg text-muted-foreground">
            Discover and purchase exclusive digital content from your favorite creators using the Stellar network.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleConnect}
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect Stellar Wallet"
            )}
          </Button>

          {showError && error && (
            <>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <Button onClick={handleConnect} variant="outline" className="w-full bg-transparent">
                Reintentar
              </Button>
            </>
          )}

          <p className="text-sm text-muted-foreground">
            Don't have a Stellar wallet?{" "}
            <a
              href="https://www.stellar.org/wallets"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Learn more about Stellar
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
