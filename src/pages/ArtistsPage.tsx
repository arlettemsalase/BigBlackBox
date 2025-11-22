import { Header } from "@/components/header"
import { mockArtists } from "@/lib/mock-artists"
import { Link } from "react-router-dom"

export default function ArtistsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="mx-auto max-w-[1200px] px-4 py-12">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl font-bold md:text-5xl">Featured Artists</h1>
          <p className="text-lg text-muted-foreground">
            Discover new creators and their digital content.
          </p>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {mockArtists.map((artist) => (
            <Link
              key={artist.id}
              to={`/artists/${artist.username.replace('@', '')}`}
              className="group"
            >
              <div className="overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg">
                {/* Avatar */}
                <div className="mb-4 flex justify-center">
                  <div className="h-32 w-32 overflow-hidden rounded-full border-2 border-border transition-all group-hover:border-primary">
                    <img
                      src={artist.avatar}
                      alt={artist.displayName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Info */}
                <div className="text-center">
                  <h3 className="mb-1 font-semibold text-foreground">
                    {artist.username}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {artist.bio}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
