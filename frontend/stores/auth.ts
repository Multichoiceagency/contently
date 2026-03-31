import { defineStore } from 'pinia'
import type { User } from '~/types'

interface AuthState {
  user: User | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
  },
  actions: {
    setAuth(user: User, token: string) {
      this.user = user
      this.token = token
    },
    clearAuth() {
      this.user = null
      this.token = null
    },
  },
})
