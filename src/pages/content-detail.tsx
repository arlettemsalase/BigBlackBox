"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useWallet } from "@/hooks/useWallet"
import { useNavigate } from "react-router-dom"
import { getContentById } from "@/lib/mock-backend"
import type { Content } from "@/lib/types"

export default function ContentDetailPage() {
  const { id } = useParams()
  const { isConnected } = useWallet()
  const navigate = useNavigate()
  const [content, setContent] = useState<Content | null>(null)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      if (!id) return

      setIsLoading(true)
      try {
        const data = await getContentById(id)
        setContent(data)
      } catch (error) {
        console.error("[v0] Failed to load content:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [id])

  const handlePurchaseSuccess = async () => {
    if (!id) return
    const updatedContent = await getContentById(id)
    setContent(updatedContent)
  }
}
