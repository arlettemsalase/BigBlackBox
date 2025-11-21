"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Box, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/lib/wallet-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ValuePropStrip } from "@/components/value-prop-strip"

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
      <div className="w-full max-w-2xl space-y-8 text-center">
        <div className="flex justify-center">
          <Box className="h-16 w-16 text-primary" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Paga a creadores de forma privada con Stellar
          </h1>
          <p className="text-lg text-muted-foreground">
            Conecta tu wallet, compra contenido en segundos y demuestra propiedad sin exponer tu identidad. El mensaje y la
            experiencia son los mismos que viste en el home: claros, auditables y listos para jurados exigentes.
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

        <ValuePropStrip variant="compact" />
      </div>
    </div>
  )
}
