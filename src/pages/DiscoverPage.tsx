import { Header } from "@/components/header"
import { ContentCard } from "@/components/content-card"
import { mockContents } from "@/lib/mock-data"

export default function DiscoverPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">Explore Content</h1>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockContents.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      </main>
    </div>
  )
}
