import { useWorkspaceStore } from '~/stores/workspace'
import type { Workspace } from '~/types'

export function useWorkspace() {
  const store = useWorkspaceStore()

  const loadWorkspaces = () => {
    if (store.workspaces.length > 0) return

    // Mock data - replace with API call
    const mockWorkspaces: Workspace[] = [
      {
        id: '1',
        name: 'My Brand',
        slug: 'my-brand',
        plan: 'pro',
        ownerId: '1',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Client Project',
        slug: 'client-project',
        plan: 'free',
        ownerId: '1',
        createdAt: new Date().toISOString(),
      },
    ]

    store.setWorkspaces(mockWorkspaces)
    if (!store.current) {
      store.setCurrent(mockWorkspaces[0])
    }
  }

  const switchWorkspace = (workspace: Workspace) => {
    store.setCurrent(workspace)
  }

  return {
    workspaces: computed(() => store.workspaces),
    current: computed(() => store.current),
    loadWorkspaces,
    switchWorkspace,
  }
}
