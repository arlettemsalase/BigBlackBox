"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AGE_VERIFICATION_CONFIG, isAgeVerified } from "@/lib/age-verification-config"

interface AgeVerificationModalProps {
  onComplete: (success: boolean, age: number) => void
  onCancel: () => void
}

type VerificationStep = "intro" | "front-capture" | "front-preview" | "back-capture" | "back-preview" | "processing" | "result"

export function AgeVerificationModal({ onComplete, onCancel }: AgeVerificationModalProps) {
  const [step, setStep] = useState<VerificationStep>("intro")
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [frontImage, setFrontImage] = useState<string | null>(null)
  const [backImage, setBackImage] = useState<string | null>(null)
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; age: number } | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    return () => {
      // Cleanup: stop camera when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Could not access camera. Please ensure camera permissions are granted.")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        return canvas.toDataURL("image/jpeg")
      }
    }
    return null
  }

  const handleStartFrontCapture = async () => {
    setStep("front-capture")
    await startCamera()
  }

  const handleCaptureFront = () => {
    const image = captureImage()
    if (image) {
      setFrontImage(image)
      stopCamera()
      setStep("front-preview")
    }
  }

  const handleRetakeFront = async () => {
    setFrontImage(null)
    setStep("front-capture")
    await startCamera()
  }

  const handleConfirmFront = async () => {
    setStep("back-capture")
    await startCamera()
  }

  const handleCaptureBack = () => {
    const image = captureImage()
    if (image) {
      setBackImage(image)
      stopCamera()
      setStep("back-preview")
    }
  }

  const handleRetakeBack = async () => {
    setBackImage(null)
    setStep("back-capture")
    await startCamera()
  }

  const handleConfirmBack = () => {
    stopCamera()
    setStep("processing")
    
    // Simulate ID verification processing
    setTimeout(() => {
      const mockAge = AGE_VERIFICATION_CONFIG.MOCK_AGE
      const success = isAgeVerified(mockAge)
      setVerificationResult({ success, age: mockAge })
      setStep("result")
      
      setTimeout(() => {
        onComplete(success, mockAge)
      }, 2000)
    }, 3000)
  }

  const handleCancel = () => {
    stopCamera()
    onCancel()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-xl bg-card shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="border-b border-border p-6 bg-muted/50">
          <h2 className="text-2xl font-bold">Identity Verification</h2>
          <p className="text-sm text-muted-foreground mt-1">
            We need to verify your age to comply with regulations
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "intro" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Capture ID Front</h3>
                    <p className="text-sm text-muted-foreground">Take a photo of the front of your ID</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Capture ID Back</h3>
                    <p className="text-sm text-muted-foreground">Take a photo of the back of your ID</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Verification</h3>
                    <p className="text-sm text-muted-foreground">We'll verify your age automatically</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                <p>• Your images are processed locally and not stored</p>
                <p>• You must be 18+ to use this platform</p>
                <p>• This process takes about 30 seconds</p>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleStartFrontCapture} className="flex-1">
                  <Camera className="mr-2 h-4 w-4" />
                  Start Verification
                </Button>
                <Button variant="outline" onClick={handleCancel} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {(step === "front-capture" || step === "back-capture") && (
            <div className="space-y-4">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-4 border-primary/50 rounded-lg pointer-events-none" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                {step === "front-capture" ? "Position the front of your ID within the frame" : "Position the back of your ID within the frame"}
              </p>
              <div className="flex gap-3">
                <Button 
                  onClick={step === "front-capture" ? handleCaptureFront : handleCaptureBack}
                  className="flex-1"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Capture
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {(step === "front-preview" || step === "back-preview") && (
            <div className="space-y-4">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <img
                  src={step === "front-preview" ? frontImage! : backImage!}
                  alt="ID Preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Is the image clear and readable?
              </p>
              <div className="flex gap-3">
                <Button 
                  onClick={step === "front-preview" ? handleConfirmFront : handleConfirmBack}
                  className="flex-1"
                >
                  Confirm
                </Button>
                <Button 
                  variant="outline" 
                  onClick={step === "front-preview" ? handleRetakeFront : handleRetakeBack}
                  className="flex-1"
                >
                  Retake
                </Button>
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center gap-6 py-12">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Verifying your identity</h3>
                <p className="text-sm text-muted-foreground">This will only take a moment...</p>
              </div>
            </div>
          )}

          {step === "result" && verificationResult && (
            <div className="flex flex-col items-center gap-6 py-12">
              {verificationResult.success ? (
                <>
                  <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">Verification Successful!</h3>
                    <p className="text-sm text-muted-foreground">
                      Age verified: {verificationResult.age} years old. You are of legal age.
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      You can now access the platform
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center">
                    <XCircle className="h-10 w-10 text-destructive" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">Verification Failed</h3>
                    <p className="text-sm text-muted-foreground">
                      Age verified: {verificationResult.age} years old. You are not of legal age.
                    </p>
                    <p className="text-sm text-destructive mt-1">
                      You must be 18 or older to use this platform
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}
