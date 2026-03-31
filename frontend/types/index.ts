export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  createdAt: string
}

export interface Workspace {
  id: string
  name: string
  slug: string
  logo?: string
  plan: 'free' | 'pro' | 'enterprise'
  ownerId: string
  createdAt: string
}

export interface SocialAccount {
  id: string
  platform: Platform
  accountName: string
  accountId: string
  avatar?: string
  status: 'connected' | 'disconnected' | 'error'
  lastSyncedAt?: string
  createdAt: string
}

export type Platform = 'linkedin' | 'facebook' | 'twitter' | 'instagram'

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed'

export interface Post {
  id: string
  content: string
  platforms: Platform[]
  status: PostStatus
  scheduledAt?: string
  publishedAt?: string
  mediaUrls: string[]
  engagement: PostEngagement
  createdAt: string
  updatedAt: string
}

export interface PostEngagement {
  likes: number
  comments: number
  shares: number
  clicks: number
  impressions: number
}

export interface AiGeneration {
  id: string
  topic: string
  platform: Platform
  tone: AiTone
  contentType: AiContentType
  result: string
  createdAt: string
}

export type AiTone = 'professional' | 'casual' | 'fun' | 'inspiring'
export type AiContentType = 'caption' | 'hashtags' | 'ideas' | 'full-post'

export interface AnalyticsData {
  date: string
  impressions: number
  clicks: number
  engagement: number
  followers: number
}

export interface TeamMember {
  id: string
  userId: string
  name: string
  email: string
  avatar?: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  joinedAt: string
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  posts: Post[]
}
