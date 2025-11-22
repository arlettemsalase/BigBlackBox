import { Header } from "@/components/header"
import { ContentCard } from "@/components/content-card"
import { mockContents } from "@/lib/mock-data"
import { Shield, Lock, Zap } from "lucide-react"

export default function DiscoverPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="/home.png" 
            alt="Hero background" 
            className="h-full w-full object-cover object-center md:object-center"
          />
          {/* Mobile: Darker overlay for better readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/85 to-background md:from-black/80 md:via-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70 md:from-black/60 md:via-transparent md:to-black/60" />
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-[1200px] px-4 py-12 md:py-20 lg:py-32">
          {/* Main Heading */}
          <div className="mb-8 max-w-3xl space-y-4 md:mb-12 md:space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 backdrop-blur-sm md:px-4 md:py-2">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary md:h-2 md:w-2" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary md:text-sm">Private Gallery</span>
            </div>
            
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              Discover exclusive content
              <span className="block bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                ready for private purchase
              </span>
            </h1>
            
            <p className="text-base text-gray-300 sm:text-lg md:text-xl lg:text-2xl">
              Select, pay with Stellar and receive your download instantly. Privacy and verifiable ownership guaranteed.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
            {/* Feature 1 */}
            <div className="group rounded-xl border border-white/10 bg-black/50 p-5 backdrop-blur-md transition-all hover:border-primary/50 hover:bg-black/60 md:p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 transition-transform group-hover:scale-110">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Blind payments on Stellar</h3>
              <p className="text-sm leading-relaxed text-gray-400">
                Every transaction is recorded with proof, without exposing your data to the creator.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-xl border border-white/10 bg-black/50 p-5 backdrop-blur-md transition-all hover:border-primary/50 hover:bg-black/60 md:p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 transition-transform group-hover:scale-110">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Private and verifiable library</h3>
              <p className="text-sm leading-relaxed text-gray-400">
                Your purchase lives in your wallet: immediate access, public traceability and absolute control.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-xl border border-white/10 bg-black/50 p-5 backdrop-blur-md transition-all hover:border-primary/50 hover:bg-black/60 md:p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 transition-transform group-hover:scale-110">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Fast and elegant experience</h3>
              <p className="text-sm leading-relaxed text-gray-400">
                Direct onboarding, purchase in seconds and optimized delivery for demanding users.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent md:h-24" />
      </section>

      {/* Gallery Section */}
      <main className="mx-auto max-w-[1200px] px-4 -mt-16 py-8">
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
