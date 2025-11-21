"use client"

import { useState, useMemo, useEffect } from "react"
import { Link } from "react-router-dom"
import { Header } from "@/components/header"
import { ContentCard } from "@/components/content-card"
import { Button } from "@/components/ui/button"
import { mockContents } from "@/lib/mock-data"
import type { Purchase } from "@/lib/types"
import { ValuePropStrip } from "@/components/value-prop-strip"

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
      <main className="mx-auto max-w-[1200px] px-4 py-8">
        <div className="mb-6 space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-secondary">Propiedad clara</p>
          <h1 className="text-3xl font-bold md:text-4xl">Tu biblioteca privada, respaldada en Stellar</h1>
          <p className="text-muted-foreground">
            Cada descarga está ligada a una compra verificable. Mantuvimos la misma narrativa en todos los endpoints para que
            puedas demostrar valor y propiedad en segundos.
          </p>
        </div>

        <ValuePropStrip variant="compact" />

        {filteredContents.length > 0 ? (
          <div className="columns-2 gap-2 md:columns-4 md:gap-3">
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
