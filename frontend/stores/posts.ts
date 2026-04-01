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
    async fetchPosts(apiBase: string, token: string, workspaceId: string) {
      this.loading = true
      try {
        const res = await $fetch<any>(`${apiBase}/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-workspace-id': workspaceId,
          },
        })
        this.posts = (res.posts || []).map((p: any) => ({
          id: p.id,
          content: p.content,
          platforms: [p.platform],
          status: p.status,
          scheduledAt: p.scheduledAt,
          publishedAt: p.publishedAt,
          mediaUrls: p.mediaUrls || [],
          engagement: {
            likes: 0,
            comments: 0,
            shares: 0,
            clicks: 0,
            impressions: 0,
          },
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        }))
      } catch {
        this.posts = []
      } finally {
        this.loading = false
      }
    },
    async createPost(apiBase: string, token: string, workspaceId: string, data: { content: string; platform: string; status: string; scheduledAt?: string }) {
      const res = await $fetch<any>(`${apiBase}/posts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-workspace-id': workspaceId,
        },
        body: data,
      })
      return res.post
    },
    async updatePostApi(apiBase: string, token: string, workspaceId: string, id: string, data: any) {
      const res = await $fetch<any>(`${apiBase}/posts/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-workspace-id': workspaceId,
        },
        body: data,
      })
      return res.post
    },
    async deletePostApi(apiBase: string, token: string, workspaceId: string, id: string) {
      await $fetch(`${apiBase}/posts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-workspace-id': workspaceId,
        },
      })
      this.posts = this.posts.filter(p => p.id !== id)
    },
    // Keep local-only methods for compatibility
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
