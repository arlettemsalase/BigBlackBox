import { Header } from "@/components/header"
import { ContentCard } from "@/components/content-card"
import { mockContents } from "@/lib/mock-data"
import { Shield, Lock, Zap } from "lucide-react"

export default function DiscoverPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-[1200px] px-4 py-12 md:py-16">
          {/* Main Heading */}
          <div className="mb-8 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Private Gallery</p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Discover exclusive content ready for private purchase
            </h1>
            <p className="max-w-3xl text-lg text-muted-foreground md:text-xl">
              Select, pay with Stellar and receive your download instantly. The same promise of privacy and verifiable ownership we present in the home lives here for any curated content.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="mb-8 rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">Big Black Box</span>
            </div>
            <p className="mb-6 text-base font-medium md:text-lg">
              Designed to convince: private purchase, clear ownership and impeccable delivery.
            </p>
            
            <div className="grid gap-6 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Blind payments on Stellar</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Every transaction is recorded with proof, without exposing your data to the creator.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Private and verifiable library</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your purchase lives in your wallet: immediate access, public traceability and absolute control.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Fast and elegant experience</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Direct onboarding, purchase in seconds and optimized delivery for demanding users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <main className="mx-auto max-w-[1200px] px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold md:text-3xl">Explore Gallery</h2>
          <p className="text-muted-foreground">Curated digital content from talented creators</p>
        </div>

        {/* Pinterest-style masonry layout */}
        <div className="columns-2 gap-2 md:columns-4 md:gap-3">
          {mockContents.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      </main>
    </div>
  )
}
