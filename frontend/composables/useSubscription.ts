import { useAuthStore } from '~/stores/auth'

export function useSubscription() {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const apiBase = config.public.apiBase as string

  const loading = ref(false)
  const error = ref('')

  const checkout = async (plan: string, period: 'monthly' | 'yearly', workspaceId: string) => {
    loading.value = true
    error.value = ''

    try {
      const res = await $fetch<{ url: string }>(`${apiBase}/stripe/checkout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: { plan, period, workspaceId },
      })

      if (res.url) {
        window.location.href = res.url
      }
    } catch (err: any) {
      const data = err?.data || err?.response?._data
      error.value = data?.message || 'Failed to start checkout'
    } finally {
      loading.value = false
    }
  }

  const openPortal = async (workspaceId: string) => {
    loading.value = true
    error.value = ''

    try {
      const res = await $fetch<{ url: string }>(`${apiBase}/stripe/portal`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: { workspaceId },
      })

      if (res.url) {
        window.location.href = res.url
      }
    } catch (err: any) {
      const data = err?.data || err?.response?._data
      error.value = data?.message || 'Failed to open billing portal'
    } finally {
      loading.value = false
    }
  }

  const getSubscription = async (workspaceId: string) => {
    try {
      const res = await $fetch<any>(`${apiBase}/stripe/subscription/${workspaceId}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      })
      return res
    } catch {
      return { plan: 'free', status: 'active' }
    }
  }

  return {
    checkout,
    openPortal,
    getSubscription,
    loading: readonly(loading),
    error: readonly(error),
  }
}
