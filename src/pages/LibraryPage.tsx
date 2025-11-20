"use client"

import { useState, useMemo, useEffect } from "react"
import { Link } from "react-router-dom"
import { Header } from "@/components/header"
import { ContentCard } from "@/components/content-card"
import { Button } from "@/components/ui/button"
import { mockContents } from "@/lib/mock-data"
import type { Purchase } from "@/lib/types"

export default function LibraryPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("purchases")
    if (stored) {
      setPurchases(JSON.parse(stored))
    }
  }, [])

  const ownedContents = useMemo(() => {
    const purchasedIds = purchases.map((p) => p.contentId)
    return mockContents.filter((c) => purchasedIds.includes(c.id)).map((c) => ({ ...c, isOwned: true }))
  }, [purchases])

  const filteredContents = ownedContents

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">My Library</h1>
        </div>

        {filteredContents.length > 0 ? (
          <div className="columns-2 gap-4 md:columns-3 lg:gap-6">
            {filteredContents.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
            <p className="text-xl font-medium">You don't have any content yet</p>
            <p className="text-muted-foreground">Start exploring and purchase content to build your library</p>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/discover">Browse Content</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
