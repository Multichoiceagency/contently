import { useWorkspaceStore } from '~/stores/workspace'
import type { Workspace } from '~/types'

export function useWorkspace() {
  const store = useWorkspaceStore()
  const config = useRuntimeConfig()
  const { token } = useAuth()

  const apiBase = config.public.apiBase as string

  const headers = computed(() => ({
    Authorization: `Bearer ${token.value}`,
    'Content-Type': 'application/json',
  }))

  const loadWorkspaces = async () => {
    if (!token.value) return
    try {
      const res = await $fetch<any>(`${apiBase}/workspaces`, {
        headers: headers.value,
      })
      const workspaces: Workspace[] = (res.workspaces || []).map((w: any) => ({
        id: w.id,
        name: w.name,
        slug: w.slug,
        logo: w.logo,
        plan: w.plan || 'free',
        role: w.role,
        ownerId: '',
        memberCount: w._count?.members || 0,
        postCount: w._count?.posts || 0,
        createdAt: w.createdAt,
      }))
      store.setWorkspaces(workspaces)
      if (!store.current && workspaces.length > 0) {
        store.setCurrent(workspaces[0])
        localStorage.setItem('flowgent_workspace', workspaces[0].id)
      }
      // Restore last used workspace
      const savedId = localStorage.getItem('flowgent_workspace')
      if (savedId) {
        const saved = workspaces.find(w => w.id === savedId)
        if (saved) store.setCurrent(saved)
      }
    } catch {
      // silently fail
    }
  }

  const createWorkspace = async (name: string) => {
    try {
      const res = await $fetch<any>(`${apiBase}/workspaces`, {
        method: 'POST',
        headers: headers.value,
        body: { name },
      })
      await loadWorkspaces()
      const ws = store.workspaces.find(w => w.id === res.workspace.id)
      if (ws) store.setCurrent(ws)
      return { success: true, workspace: res.workspace }
    } catch (error: any) {
      const data = error?.data || error?.response?._data
      return { success: false, error: data?.message || 'Failed to create workspace' }
    }
  }

  const switchWorkspace = (workspace: Workspace) => {
    store.setCurrent(workspace)
    localStorage.setItem('flowgent_workspace', workspace.id)
  }

  const needsOnboarding = computed(() => {
    return store.workspaces.length === 0 || !store.current
  })

  return {
    workspaces: computed(() => store.workspaces),
    current: computed(() => store.current),
    needsOnboarding,
    loadWorkspaces,
    createWorkspace,
    switchWorkspace,
  }
}
