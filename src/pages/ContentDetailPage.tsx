"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, ShoppingCart, Download } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { getContentById } from "@/lib/mock-backend"
import type { Content } from "@/lib/types"
import { PurchaseModal } from "@/components/purchase-modal"

export default function ContentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [content, setContent] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)

  useEffect(() => {
    const loadContent = async () => {
      if (!id) return
      
      try {
        const data = await getContentById(id)
        setContent(data)
      } catch (error) {
        console.error("Error loading content:", error)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Content not found</h1>
            <Button onClick={() => navigate("/discover")}>Back to Discover</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <img
              src={content.thumbnail}
              alt={content.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          <div>
            <div className="mb-4">
              <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
              <p className="text-muted-foreground">by {content.creator}</p>
            </div>

            <p className="text-lg mb-6">{content.description}</p>

            <div className="bg-muted p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Price</span>
                <span className="text-2xl font-bold">{content.price} XLM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Dimensions</span>
                <span>{content.width} × {content.height} px</span>
              </div>
            </div>

            {content.isOwned ? (
              <Button className="w-full" size="lg">
                <Download className="mr-2 h-5 w-5" />
                Download Image
              </Button>
            ) : (
              <Button
                className="w-full"
                size="lg"
                onClick={() => setShowPurchaseModal(true)}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Purchase for {content.price} XLM
              </Button>
            )}
          </div>
        </div>
      </div>

      {showPurchaseModal && content && (
        <PurchaseModal
          content={content}
          onClose={() => setShowPurchaseModal(false)}
          onSuccess={() => {
            setShowPurchaseModal(false)
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}
