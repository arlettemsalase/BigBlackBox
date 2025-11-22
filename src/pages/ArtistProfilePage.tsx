import { Header } from "@/components/header"
import { ContentCard } from "@/components/content-card"
import { Button } from "@/components/ui/button"
import { mockArtists } from "@/lib/mock-artists"
import { useParams, useNavigate } from "react-router-dom"
import { MessageCircle } from "lucide-react"

export default function ArtistProfilePage() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  
  const artist = mockArtists.find(a => a.username === `@${username}`)

  if (!artist) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-[1200px] px-4 py-12">
          <p className="text-center text-muted-foreground">Artist not found</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="mx-auto max-w-[1200px] px-4 py-12">
        {/* Artist Profile Header */}
        <div className="mb-12 flex flex-col items-center space-y-6 border-b border-border pb-12">
          {/* Avatar */}
          <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-primary">
            <img
              src={artist.avatar}
              alt={artist.displayName}
              className="h-full w-full object-cover"
            />
          </div>
          
          {/* Info */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">{artist.username}</h1>
            <p className="text-lg text-muted-foreground">{artist.bio}</p>
          </div>

          {/* Start Conversation Button */}
          <Button
            onClick={() => navigate(`/chat/${username}`)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Iniciar Conversación
          </Button>
        </div>

        {/* Works Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Trabajos Realizados</h2>
          
          {artist.works.length > 0 ? (
            <div className="columns-2 gap-2 md:columns-4 md:gap-3">
              {artist.works.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              No works available yet
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
