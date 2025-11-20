"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Download, Star } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/lib/wallet-context"
import { getContentById } from "@/lib/mock-backend"
import type { Content } from "@/lib/types"

export default function LibraryContentPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isConnected } = useWallet()
  const [content, setContent] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isConnected) {
      navigate("/connect")
      return
    }

    const loadContent = async () => {
      if (!id) return
      
      try {
        const data = await getContentById(id)
        if (data && data.isOwned) {
          setContent(data)
        } else {
          navigate("/library")
        }
      } catch (error) {
        console.error("Error loading content:", error)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [id, isConnected, navigate])

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
            <Button onClick={() => navigate("/library")}>Back to Library</Button>
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
          onClick={() => navigate("/library")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={content.thumbnail}
              alt={content.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
                <p className="text-muted-foreground">by {content.creator}</p>
              </div>
              <Badge>{content.type}</Badge>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 font-semibold">{content.rating}</span>
              </div>
              <span className="text-muted-foreground">
                ({content.reviewCount} reviews)
              </span>
            </div>

            <p className="text-lg mb-6">{content.description}</p>

            {content.tags && (
              <div className="flex flex-wrap gap-2 mb-6">
                {content.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="bg-muted p-4 rounded-lg mb-6">
              {content.duration && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{content.duration}</span>
                </div>
              )}
              {content.size && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Size</span>
                  <span>{content.size}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Button className="w-full" size="lg">
                <Download className="mr-2 h-5 w-5" />
                Download Content
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/content/${id}/review`)}
              >
                Write a Review
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
