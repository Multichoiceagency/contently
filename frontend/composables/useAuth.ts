import { useAuthStore } from '~/stores/auth'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const config = useRuntimeConfig()

  const apiBase = config.public.apiBase as string
  const dashboardDomain = config.public.dashboardDomain as string || 'dashboard.contentrich.nl'

  const goToDashboard = () => {
    if (import.meta.client) {
      const hostname = window.location.hostname
      const isDashboard = hostname.startsWith('dashboard.')
      if (isDashboard) {
        router.push('/dashboard')
      } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
        router.push('/dashboard')
      } else {
        window.location.href = `https://${dashboardDomain}/dashboard`
      }
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const res = await $fetch<any>(`${apiBase}/auth/login`, {
        method: 'POST',
        body: { email, password },
      })

      authStore.setAuth(res.user, res.accessToken)
      localStorage.setItem('flowgent_token', res.accessToken)
      localStorage.setItem('flowgent_refresh', res.refreshToken)
      localStorage.setItem('flowgent_user', JSON.stringify(res.user))

      goToDashboard()
      return { success: true }
    } catch (error: any) {
      const data = error?.data || error?.response?._data
      if (data?.requiresVerification) {
        await router.push(`/auth/verify?email=${encodeURIComponent(data.email)}`)
        return { success: true }
      }
      return { success: false, error: data?.message || 'Login failed' }
    }
  }

  const register = async (name: string, email: string, password: string, _workspaceName?: string) => {
    try {
      const res = await $fetch<any>(`${apiBase}/auth/register`, {
        method: 'POST',
        body: { email, password, name },
      })

      if (res.requiresVerification) {
        await router.push(`/auth/verify?email=${encodeURIComponent(res.email)}`)
        return { success: true }
      }

      return { success: true }
    } catch (error: any) {
      const data = error?.data || error?.response?._data
      return { success: false, error: data?.message || 'Registration failed' }
    }
  }

  const verifyEmail = async (email: string, code: string) => {
    try {
      const res = await $fetch<any>(`${apiBase}/auth/verify`, {
        method: 'POST',
        body: { email, code },
      })

      authStore.setAuth(res.user, res.accessToken)
      localStorage.setItem('flowgent_token', res.accessToken)
      localStorage.setItem('flowgent_refresh', res.refreshToken)
      localStorage.setItem('flowgent_user', JSON.stringify(res.user))

      goToDashboard()
      return { success: true }
    } catch (error: any) {
      const data = error?.data || error?.response?._data
      return { success: false, error: data?.message || 'Verification failed' }
    }
  }

  const resendCode = async (email: string) => {
    try {
      await $fetch(`${apiBase}/auth/resend-code`, {
        method: 'POST',
        body: { email },
      })
      return { success: true }
    } catch (error: any) {
      const data = error?.data || error?.response?._data
      return { success: false, error: data?.message || 'Failed to resend code' }
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      await $fetch(`${apiBase}/auth/forgot-password`, {
        method: 'POST',
        body: { email },
      })
      return { success: true }
    } catch (error: any) {
      const data = error?.data || error?.response?._data
      return { success: false, error: data?.message || 'Failed to send reset code' }
    }
  }

  const resetPassword = async (email: string, code: string, password: string) => {
    try {
      await $fetch(`${apiBase}/auth/reset-password`, {
        method: 'POST',
        body: { email, code, password },
      })
      return { success: true }
    } catch (error: any) {
      const data = error?.data || error?.response?._data
      return { success: false, error: data?.message || 'Password reset failed' }
    }
  }

  const googleLogin = async (credential: string) => {
    try {
      const res = await $fetch<any>(`${apiBase}/auth/google`, {
        method: 'POST',
        body: { credential },
      })

      authStore.setAuth(res.user, res.accessToken)
      localStorage.setItem('flowgent_token', res.accessToken)
      localStorage.setItem('flowgent_refresh', res.refreshToken)
      localStorage.setItem('flowgent_user', JSON.stringify(res.user))

      goToDashboard()
      return { success: true }
    } catch (error: any) {
      const data = error?.data || error?.response?._data
      return { success: false, error: data?.message || 'Google login failed' }
    }
  }

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('flowgent_refresh')
      if (authStore.token) {
        await $fetch(`${apiBase}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${authStore.token}` },
          body: { refreshToken },
        }).catch(() => {})
      }
    } finally {
      authStore.clearAuth()
      localStorage.removeItem('flowgent_token')
      localStorage.removeItem('flowgent_refresh')
      localStorage.removeItem('flowgent_user')
      if (import.meta.client) {
        const hostname = window.location.hostname
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          router.push('/auth/login')
        } else {
          const mainDomain = config.public.mainDomain as string || 'contentrich.nl'
          window.location.href = `https://${mainDomain}/auth/login`
        }
      }
    }
  }

  const restoreSession = async () => {
    if (import.meta.server) return
    const token = localStorage.getItem('flowgent_token')
    const userJson = localStorage.getItem('flowgent_user')
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson)
        authStore.setAuth(user, token)

        // Validate token with /auth/me
        const me = await $fetch<any>(`${apiBase}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => null)

        if (me) {
          authStore.setAuth(me, token)
          localStorage.setItem('flowgent_user', JSON.stringify(me))
        } else {
          // Try refresh
          const refreshToken = localStorage.getItem('flowgent_refresh')
          if (refreshToken) {
            try {
              const res = await $fetch<any>(`${apiBase}/auth/refresh`, {
                method: 'POST',
                body: { refreshToken },
              })
              authStore.setAuth(user, res.accessToken)
              localStorage.setItem('flowgent_token', res.accessToken)
              localStorage.setItem('flowgent_refresh', res.refreshToken)
            } catch {
              logout()
            }
          } else {
            logout()
          }
        }
      } catch {
        logout()
      }
    }
  }

  return {
    login,
    googleLogin,
    register,
    verifyEmail,
    resendCode,
    forgotPassword,
    resetPassword,
    logout,
    restoreSession,
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    token: computed(() => authStore.token),
  }
}
