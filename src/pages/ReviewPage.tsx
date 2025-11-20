"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Star } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/lib/wallet-context"
import { getContentById, submitReview } from "@/lib/mock-backend"
import type { Content } from "@/lib/types"

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isConnected, address } = useWallet()
  const [content, setContent] = useState<Content | null>(null)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
          navigate("/discover")
        }
      } catch (error) {
        console.error("Error loading content:", error)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [id, isConnected, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!id || !address || rating === 0) {
      setError("Please select a rating")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await submitReview({
        contentId: id,
        userId: address,
        rating,
        comment,
      })
      
      navigate(`/content/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review")
    } finally {
      setSubmitting(false)
    }
  }

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
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate(`/content/${id}`)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="bg-card border rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-2">Write a Review</h1>
          <p className="text-muted-foreground mb-6">for {content.title}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Rating *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        value <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium mb-2">
                Your Review
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this content..."
                className="w-full min-h-[150px] px-3 py-2 border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={submitting || rating === 0}
                className="flex-1"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/content/${id}`)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
