"use client"

import { useState, useMemo, useEffect } from "react"
import { Link } from "react-router-dom"
import { Header } from "@/components/header"
import { ContentCard } from "@/components/content-card"
import { Button } from "@/components/ui/button"
import { mockContents } from "@/lib/mock-data"
import type { ContentType, Purchase } from "@/lib/types"

const filters: { label: string; value: ContentType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Videos", value: "video" },
  { label: "eBooks", value: "ebook" },
  { label: "Courses", value: "course" },
]

export default function LibraryPage() {
  const [activeFilter, setActiveFilter] = useState<ContentType | "all">("all")
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

  const filteredContents = useMemo(() => {
    return ownedContents.filter((content) => {
      return activeFilter === "all" || content.type === activeFilter
    })
  }, [ownedContents, activeFilter])

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold md:text-4xl">My Library</h1>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.value}
                variant={activeFilter === filter.value ? "default" : "outline"}
                onClick={() => setActiveFilter(filter.value)}
                className={activeFilter === filter.value ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {filteredContents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
