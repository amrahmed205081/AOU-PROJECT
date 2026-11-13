export interface Category {
  id: string
  slug: string
  name: string
  description: string
  image: string
}

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string[]
  categoryId: string
  author: string
  publishedAt: string
  featuredImage: string
  videoId: string | null
  isFeatured: boolean
  isPopular: boolean
}

export interface VideoItem {
  id: string
  title: string
  excerpt: string
  categoryId: string
  poster: string
  videoId: string | null
}

export interface NavItem {
  label: string
  to: string
}
