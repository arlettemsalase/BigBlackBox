import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import type { Content } from "@/lib/types"

interface ContentCardProps {
  content: Content
}

export function ContentCard({ content }: ContentCardProps) {
  const typeLabels: Record<string, string> = {
    video: "Video",
    audio: "Audio",
    ebook: "E-Book",
    course: "Course",
    image: "Image",
  }

  return (
    <Link to={content.isOwned ? `/library/${content.id}` : `/content/${content.id}`} className="group block">
      <div className="overflow-hidden rounded-lg bg-card transition-transform hover:scale-[1.02]">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={content.thumbnail || "/placeholder.svg"}
            alt={content.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute right-2 top-2">
            <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur">
              {typeLabels[content.type]}
            </Badge>
          </div>
          {content.isOwned && (
            <div className="absolute left-2 top-2">
              <Badge className="bg-secondary text-secondary-foreground">Owned</Badge>
            </div>
          )}
        </div>
        <div className="space-y-2 p-4">
          <h3 className="line-clamp-1 font-semibold text-foreground">{content.title}</h3>
          <p className="text-sm text-muted-foreground">By {content.creator}</p>
          <p className="text-lg font-bold text-secondary">${content.price}</p>
        </div>
      </div>
    </Link>
  )
}
