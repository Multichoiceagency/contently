import { useAuthStore } from '~/stores/auth'

/**
 * Get the cookie domain for cross-subdomain sharing.
 * Returns `.contentrich.nl` in production so cookies are shared
 * between contentrich.nl and dashboard.contentrich.nl.
 * Returns undefined on localhost (default browser behavior).
 */
function getCookieDomain(): string | undefined {
  const config = useRuntimeConfig()
  const mainDomain = config.public.mainDomain as string || 'contentrich.nl'
  if (mainDomain === 'localhost' || mainDomain === '127.0.0.1') return undefined
  return `.${mainDomain}`
}

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const config = useRuntimeConfig()

  const apiBase = config.public.apiBase as string
  const dashboardDomain = config.public.dashboardDomain as string || 'dashboard.contentrich.nl'

  // Shared cookies across subdomains (works on SSR + client)
  const tokenCookie = useCookie('flowgent_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    domain: getCookieDomain(),
    sameSite: 'lax',
    secure: true,
  })
  const refreshCookie = useCookie('flowgent_refresh', {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
    domain: getCookieDomain(),
    sameSite: 'lax',
    secure: true,
  })
  const userCookie = useCookie('flowgent_user', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    domain: getCookieDomain(),
    sameSite: 'lax',
    secure: true,
  })

  const saveTokens = (accessToken: string, refreshToken: string, user: any) => {
    tokenCookie.value = accessToken
    refreshCookie.value = refreshToken
    userCookie.value = JSON.stringify(user)
    authStore.setAuth(user, accessToken)
  }

  const clearTokens = () => {
    tokenCookie.value = null
    refreshCookie.value = null
    userCookie.value = null
    authStore.clearAuth()
  }

  const goToDashboard = () => {
    if (import.meta.client) {
      const hostname = window.location.hostname
      const isDashboard = hostname.startsWith('dashboard.')
      if (isDashboard || hostname === 'localhost' || hostname === '127.0.0.1') {
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

      saveTokens(res.accessToken, res.refreshToken, res.user)

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

      saveTokens(res.accessToken, res.refreshToken, res.user)

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

      saveTokens(res.accessToken, res.refreshToken, res.user)

      goToDashboard()
      return { success: true }
    } catch (error: any) {
      const data = error?.data || error?.response?._data
      return { success: false, error: data?.message || 'Google login failed' }
    }
  }

  const logout = async () => {
    try {
      const rt = refreshCookie.value
      if (authStore.token) {
        await $fetch(`${apiBase}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${authStore.token}` },
          body: { refreshToken: rt },
        }).catch(() => {})
      }
    } finally {
      clearTokens()
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
    const token = tokenCookie.value
    const userJson = userCookie.value
    if (token && userJson) {
      try {
        const user = typeof userJson === 'string' ? JSON.parse(userJson) : userJson
        authStore.setAuth(user, token)

        if (import.meta.client) {
          const me = await $fetch<any>(`${apiBase}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => null)

          if (me) {
            authStore.setAuth(me, token)
            userCookie.value = JSON.stringify(me)
          } else {
            const rt = refreshCookie.value
            if (rt) {
              try {
                const res = await $fetch<any>(`${apiBase}/auth/refresh`, {
                  method: 'POST',
                  body: { refreshToken: rt },
                })
                saveTokens(res.accessToken, res.refreshToken, user)
              } catch {
                logout()
              }
            } else {
              logout()
            }
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
