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
