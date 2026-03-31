type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'

interface ApiFetchOptions {
  method?: HttpMethod
  body?: any
  headers?: Record<string, string>
  params?: Record<string, string>
}

export function useApi() {
  const config = useRuntimeConfig()
  const { token, logout } = useAuth()
  const { addToast } = useToast()

  const apiFetch = async <T>(
    endpoint: string,
    options: ApiFetchOptions = {}
  ): Promise<T> => {
    const url = `${config.public.apiBase}${endpoint}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    }

    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    try {
      const response = await $fetch<T>(url, {
        method: options.method,
        body: options.body,
        headers,
        params: options.params,
      })
      return response
    } catch (error: any) {
      if (error.statusCode === 401) {
        addToast('Session expired. Please log in again.', 'error')
        logout()
      } else if (error.statusCode >= 500) {
        addToast('Server error. Please try again later.', 'error')
      } else if (error.data?.message) {
        addToast(error.data.message, 'error')
      }
      throw error
    }
  }

  return { apiFetch }
}
