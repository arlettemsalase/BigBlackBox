import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import type { Content } from "@/lib/types"

interface ContentCardProps {
  content: Content
}

export function ContentCard({ content }: ContentCardProps) {
  return (
    <Link 
      to={content.isOwned ? `/library/${content.id}` : `/content/${content.id}`} 
      className="group block mb-2 break-inside-avoid"
    >
      <div className="overflow-hidden rounded-lg bg-card transition-all hover:shadow-xl">
        <div className="relative overflow-hidden">
          <img
            src={content.thumbnail || "/placeholder.svg"}
            alt={content.title}
            className="w-full object-cover transition-transform group-hover:scale-105"
            style={{ aspectRatio: `${content.width}/${content.height}` }}
          />
          {content.isOwned && (
            <div className="absolute right-2 top-2">
              <Badge className="bg-secondary text-secondary-foreground">Owned</Badge>
            </div>
          )}
        </div>
        <div className="space-y-1 p-3">
          <h3 className="line-clamp-2 font-semibold text-sm text-foreground">{content.title}</h3>
          <p className="text-xs text-muted-foreground">By {content.creator}</p>
          <p className="text-base font-bold text-primary">{content.price} XLM</p>
        </div>
      </div>
    </Link>
  )
}
