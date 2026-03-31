import { defineStore } from 'pinia'
import type { Workspace } from '~/types'

interface WorkspaceState {
  current: Workspace | null
  workspaces: Workspace[]
}

export const useWorkspaceStore = defineStore('workspace', {
  state: (): WorkspaceState => ({
    current: null,
    workspaces: [],
  }),
  actions: {
    setCurrent(workspace: Workspace) {
      this.current = workspace
    },
    setWorkspaces(workspaces: Workspace[]) {
      this.workspaces = workspaces
    },
  },
})
