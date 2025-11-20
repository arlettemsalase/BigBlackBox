import type { Content, Review } from "./types"

export const mockContents: Content[] = [
  {
    id: "1",
    title: "Advanced React Patterns",
    creator: "Sarah Johnson",
    type: "course",
    price: 49.99,
    description: "Master advanced React patterns including hooks, context, and performance optimization techniques.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 124,
    tags: ["React", "JavaScript", "Web Development"],
    duration: "8 hours",
    size: "2.4 GB"
  },
  {
    id: "2",
    title: "Stellar Blockchain Fundamentals",
    creator: "Michael Chen",
    type: "video",
    price: 29.99,
    description: "Complete guide to understanding and building on the Stellar blockchain network.",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 89,
    tags: ["Blockchain", "Stellar", "Cryptocurrency"],
    duration: "3 hours",
    size: "1.2 GB"
  },
  {
    id: "3",
    title: "Digital Art Masterclass",
    creator: "Emma Williams",
    type: "course",
    price: 79.99,
    description: "Learn professional digital art techniques from concept to final render.",
    thumbnail: "https://images.unsplash.com/photo-1561998338-13ad7883b20f?w=400&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 203,
    tags: ["Art", "Design", "Digital"],
    duration: "12 hours",
    size: "4.8 GB"
  },
  {
    id: "4",
    title: "Meditation & Mindfulness Guide",
    creator: "David Martinez",
    type: "audio",
    price: 19.99,
    description: "Guided meditation sessions for stress relief and mental clarity.",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop",
    rating: 4.6,
    reviewCount: 156,
    tags: ["Wellness", "Meditation", "Health"],
    duration: "2 hours",
    size: "180 MB"
  },
  {
    id: "5",
    title: "Web3 Development Handbook",
    creator: "Alex Thompson",
    type: "ebook",
    price: 24.99,
    description: "Comprehensive guide to building decentralized applications on various blockchain platforms.",
    thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 92,
    tags: ["Web3", "Blockchain", "Development"],
    size: "15 MB"
  },
  {
    id: "6",
    title: "Photography Composition Secrets",
    creator: "Lisa Anderson",
    type: "video",
    price: 34.99,
    description: "Master the art of photographic composition with professional techniques.",
    thumbnail: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 178,
    tags: ["Photography", "Art", "Composition"],
    duration: "4 hours",
    size: "1.8 GB"
  },
  {
    id: "7",
    title: "Electronic Music Production",
    creator: "Ryan Cooper",
    type: "course",
    price: 89.99,
    description: "Complete course on producing electronic music from scratch to mastering.",
    thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 145,
    tags: ["Music", "Production", "Electronic"],
    duration: "15 hours",
    size: "6.2 GB"
  },
  {
    id: "8",
    title: "Cybersecurity Essentials",
    creator: "Jennifer Lee",
    type: "course",
    price: 59.99,
    description: "Learn essential cybersecurity practices to protect yourself and your organization.",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 167,
    tags: ["Security", "Technology", "IT"],
    duration: "10 hours",
    size: "3.5 GB"
  }
]

export const mockReviews: Review[] = [
  {
    id: "r1",
    contentId: "1",
    userId: "user1",
    userName: "John Doe",
    rating: 5,
    comment: "Excellent course! The advanced patterns section was particularly helpful.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "r2",
    contentId: "1",
    userId: "user2",
    userName: "Jane Smith",
    rating: 4,
    comment: "Great content, but could use more real-world examples.",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "r3",
    contentId: "2",
    userId: "user3",
    userName: "Bob Wilson",
    rating: 5,
    comment: "Perfect introduction to Stellar blockchain. Highly recommended!",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
]
