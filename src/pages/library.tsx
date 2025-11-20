"use client"

import { useEffect, useState } from "react"
import { useWallet } from "@/hooks/useWallet"
import { useNavigate } from "react-router-dom"
import { getOwnedContent } from "@/lib/mock-backend"
import type { Content } from "@/lib/types"

export default function LibraryPage() {
  const { isConnected } = useWallet()
  const navigate = useNavigate()
  const [ownedContent, setOwnedContent] = useState<Content[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadLibrary = async () => {
      setIsLoading(true)
      try {
        const data = await getOwnedContent()
        setOwnedContent(data)
      } catch (error) {
        console.error("[v0] Failed to load library:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isConnected) {
      loadLibrary()
    }
  }, [isConnected])
}
