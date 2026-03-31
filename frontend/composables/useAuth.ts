import { useAuthStore } from '~/stores/auth'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const config = useRuntimeConfig()

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 800))

      const mockUser = {
        id: '1',
        name: 'John Doe',
        email,
        avatar: undefined,
        role: 'owner' as const,
        createdAt: new Date().toISOString(),
      }
      const mockToken = 'mock-jwt-token-' + Date.now()

      authStore.setAuth(mockUser, mockToken)
      localStorage.setItem('flowgent_token', mockToken)
      localStorage.setItem('flowgent_user', JSON.stringify(mockUser))

      await router.push('/dashboard')
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' }
    }
  }

  const register = async (name: string, email: string, password: string, workspaceName: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800))

      const mockUser = {
        id: '1',
        name,
        email,
        avatar: undefined,
        role: 'owner' as const,
        createdAt: new Date().toISOString(),
      }
      const mockToken = 'mock-jwt-token-' + Date.now()

      authStore.setAuth(mockUser, mockToken)
      localStorage.setItem('flowgent_token', mockToken)
      localStorage.setItem('flowgent_user', JSON.stringify(mockUser))

      await router.push('/dashboard')
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' }
    }
  }

  const logout = () => {
    authStore.clearAuth()
    localStorage.removeItem('flowgent_token')
    localStorage.removeItem('flowgent_user')
    router.push('/auth/login')
  }

  const restoreSession = () => {
    if (import.meta.server) return
    const token = localStorage.getItem('flowgent_token')
    const userJson = localStorage.getItem('flowgent_user')
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson)
        authStore.setAuth(user, token)
      } catch {
        logout()
      }
    }
  }

  return {
    login,
    register,
    logout,
    restoreSession,
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    token: computed(() => authStore.token),
  }
}
