import { defineStore } from 'pinia'
import type { Post, PostStatus, Platform } from '~/types'

interface PostsState {
  posts: Post[]
  loading: boolean
  filters: {
    status: PostStatus | 'all'
    platform: Platform | 'all'
    search: string
  }
}

export const usePostsStore = defineStore('posts', {
  state: (): PostsState => ({
    posts: [],
    loading: false,
    filters: {
      status: 'all',
      platform: 'all',
      search: '',
    },
  }),
  getters: {
    filteredPosts(state): Post[] {
      return state.posts.filter((post) => {
        if (state.filters.status !== 'all' && post.status !== state.filters.status) return false
        if (state.filters.platform !== 'all' && !post.platforms.includes(state.filters.platform)) return false
        if (state.filters.search && !post.content.toLowerCase().includes(state.filters.search.toLowerCase())) return false
        return true
      })
    },
    draftCount(state): number {
      return state.posts.filter(p => p.status === 'draft').length
    },
    scheduledCount(state): number {
      return state.posts.filter(p => p.status === 'scheduled').length
    },
    publishedCount(state): number {
      return state.posts.filter(p => p.status === 'published').length
    },
  },
  actions: {
    async loadPosts() {
      this.loading = true
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      this.posts = generateMockPosts()
      this.loading = false
    },
    addPost(post: Post) {
      this.posts.unshift(post)
    },
    updatePost(id: string, updates: Partial<Post>) {
      const index = this.posts.findIndex(p => p.id === id)
      if (index > -1) {
        this.posts[index] = { ...this.posts[index], ...updates }
      }
    },
    deletePost(id: string) {
      this.posts = this.posts.filter(p => p.id !== id)
    },
    setFilter(key: keyof PostsState['filters'], value: string) {
      (this.filters as any)[key] = value
    },
  },
})

function generateMockPosts(): Post[] {
  const platforms: Platform[] = ['linkedin', 'facebook', 'twitter', 'instagram']
  const statuses: PostStatus[] = ['draft', 'scheduled', 'published', 'published', 'scheduled']
  const contents = [
    'Excited to announce our new AI-powered analytics dashboard! Track your social media performance like never before.',
    'Looking for tips on growing your LinkedIn presence? Here are 5 strategies that actually work in 2026.',
    'Happy Friday everyone! What are your plans for the weekend? Tell us in the comments below.',
    'We just hit 10K followers! Thank you all for your amazing support. Stay tuned for a special announcement.',
    'New blog post: "The Future of Social Media Marketing with AI" - Link in bio.',
    'Behind the scenes at our latest product photoshoot. The new collection drops next week!',
    'Pro tip: Consistency is key in social media. Post at least 3 times a week to maintain engagement.',
    'Join us for a live Q&A session this Thursday at 2 PM EST. Bring your questions!',
    'Customer spotlight: See how @TechStartup increased their engagement by 300% using Flowgent.',
    'The social media landscape is evolving. Are you keeping up? Read our latest insights.',
    'Launching something big next month. Stay tuned for details!',
    'Our team is growing! Check out open positions on our careers page.',
  ]

  return contents.map((content, i) => {
    const status = statuses[i % statuses.length]
    const daysAgo = Math.floor(Math.random() * 30)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)

    const scheduledDate = new Date()
    scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 14))

    return {
      id: (i + 1).toString(),
      content,
      platforms: [platforms[i % platforms.length], ...(i % 3 === 0 ? [platforms[(i + 1) % platforms.length]] : [])],
      status,
      scheduledAt: status === 'scheduled' ? scheduledDate.toISOString() : undefined,
      publishedAt: status === 'published' ? date.toISOString() : undefined,
      mediaUrls: [],
      engagement: {
        likes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 80),
        shares: Math.floor(Math.random() * 120),
        clicks: Math.floor(Math.random() * 300),
        impressions: Math.floor(Math.random() * 5000),
      },
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    }
  })
}
