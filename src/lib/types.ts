export type ContentType = "video" | "audio" | "ebook" | "course" | "image"

export interface Content {
  id: string
  title: string
  creator: string
  type: ContentType
  price: number
  description: string
  thumbnail: string
  rating: number
  reviewCount: number
  isOwned?: boolean
  tags?: string[]
  fileUrl?: string
  duration?: string
  size?: string
}

export interface Purchase {
  contentId: string
  purchaseDate: string
  transactionHash: string
}

export interface Review {
  id: string
  contentId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}
