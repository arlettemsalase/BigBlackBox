"use client"

import { useEffect, useState } from "react"
import { useWallet } from "@/hooks/useWallet"
import { useNavigate } from "react-router-dom"
import { getAllContent } from "@/lib/mock-backend"
import type { Content } from "@/lib/types"
import Loader2 from "@/components/Loader2"
import Header from "@/components/Header"
import ContentCard from "@/components/ContentCard"

export default function DiscoverPage() {
  const { isConnected } = useWallet()
  const navigate = useNavigate()
  const [contents, setContents] = useState<Content[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isConnected) {
      navigate("/connect")
    }
  }, [isConnected, navigate])

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true)
      try {
        const data = await getAllContent()
        setContents(data)
      } catch (error) {
        console.error("[v0] Failed to load content:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Explore Content</h1>
          <p className="text-muted-foreground">Discover exclusive digital content from creators</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {contents.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      </main>
    </div>
  )
}
