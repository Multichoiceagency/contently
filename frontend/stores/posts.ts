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
      this.loading = false
    },
    setPosts(posts: Post[]) {
      this.posts = posts
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
    clear() {
      this.posts = []
      this.loading = false
    },
  },
})
