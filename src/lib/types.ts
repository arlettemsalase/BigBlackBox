export interface Content {
  id: string
  title: string
  creator: string
  price: number
  description: string
  thumbnail: string
  width: number
  height: number
  isOwned?: boolean
  fileUrl?: string
}

export interface Purchase {
  contentId: string
  purchaseDate: string
  transactionHash: string
}

export interface Artist {
  id: string
  username: string
  displayName: string
  bio: string
  avatar: string
  works: Content[]
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: string
  type: 'text' | 'product-link'
  productLink?: {
    id: string
    title: string
    thumbnail: string
    price: number
    creator: string
  }
}
