import type { Content, Purchase, Review } from "./types"
import { mockContents, mockReviews } from "./mock-data"

// ============================================
// PURCHASES (STELLAR TRANSACTIONS)
// ============================================

export const purchaseContent = async (contentId: string, _walletAddress: string): Promise<Purchase> => {
  // Simulate blockchain transaction delay
  await new Promise((resolve) => setTimeout(resolve, 2500))

  // Simulate 70% success rate (for demo purposes)
  if (Math.random() < 0.7) {
    const purchase: Purchase = {
      contentId,
      purchaseDate: new Date().toISOString(),
      transactionHash: "MOCK_TX_" + Math.random().toString(36).substring(2, 15).toUpperCase(),
    }

    // Save to localStorage (simulating database)
    const purchases = getPurchases()
    purchases.push(purchase)
    localStorage.setItem("purchases", JSON.stringify(purchases))

    return purchase
  } else {
    throw new Error("Transaction failed. Please try again.")
  }
}

export const getPurchases = (): Purchase[] => {
  const data = localStorage.getItem("purchases")
  return data ? JSON.parse(data) : []
}

export const hasUserPurchased = (contentId: string): boolean => {
  const purchases = getPurchases()
  return purchases.some((p) => p.contentId === contentId)
}

// ============================================
// CONTENT LIBRARY
// ============================================

export const getAllContent = async (): Promise<Content[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockContents
}

export const getContentById = async (id: string): Promise<Content | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const content = mockContents.find((c) => c.id === id)
  if (!content) return null

  // Add ownership status
  return {
    ...content,
    isOwned: hasUserPurchased(id),
  }
}

export const getOwnedContent = async (): Promise<Content[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  const purchases = getPurchases()
  const ownedIds = purchases.map((p) => p.contentId)

  return mockContents.filter((c) => ownedIds.includes(c.id)).map((c) => ({ ...c, isOwned: true }))
}

// ============================================
// REVIEWS
// ============================================

export const submitReview = async (review: Omit<Review, "id" | "createdAt" | "userName">): Promise<Review> => {
  // Check if user owns the content
  if (!hasUserPurchased(review.contentId)) {
    throw new Error("You must purchase this content before leaving a review")
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const newReview: Review = {
    ...review,
    id: "review_" + Math.random().toString(36).substring(2, 15),
    createdAt: new Date().toISOString(),
    userName: "Anonymous User",
  }

  // Save to localStorage (simulating database)
  const reviews = getReviews()
  reviews.push(newReview)
  localStorage.setItem("reviews", JSON.stringify(reviews))

  return newReview
}

export const getReviews = (): Review[] => {
  const data = localStorage.getItem("reviews")
  return data ? JSON.parse(data) : [...mockReviews] // Start with some mock reviews
}

export const getReviewsByContentId = (contentId: string): Review[] => {
  const allReviews = getReviews()
  return allReviews.filter((r) => r.contentId === contentId)
}

// ============================================
// STELLAR WALLET (MOCK)
// ============================================

export const connectWallet = async (): Promise<string> => {
  // Simulate wallet connection delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Simulate 70% success rate
  if (Math.random() > 0.3) {
    const mockAddress =
      "G" +
      Math.random().toString(36).substring(2, 15).toUpperCase() +
      Math.random().toString(36).substring(2, 15).toUpperCase()
    return mockAddress
  } else {
    throw new Error("Connection failed. Please check your wallet and try again.")
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const clearAllMockData = () => {
  localStorage.removeItem("purchases")
  localStorage.removeItem("reviews")
  localStorage.removeItem("stellar_address")
}
