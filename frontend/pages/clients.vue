<script setup lang="ts">
import {
  UserGroupIcon,
  PlusIcon,
  BuildingOffice2Icon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  ChartBarIcon,
} from '@heroicons/vue/24/outline'

const { addToast } = useToast()
const { token } = useAuth()
const { workspaces, createWorkspace, switchWorkspace, loadWorkspaces } = useWorkspace()
const router = useRouter()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

const showCreate = ref(false)
const newClientName = ref('')
const creating = ref(false)
const searchQuery = ref('')

const filteredClients = computed(() => {
  if (!searchQuery.value) return workspaces.value
  const q = searchQuery.value.toLowerCase()
  return workspaces.value.filter(w => w.name.toLowerCase().includes(q))
})

const handleCreate = async () => {
  if (!newClientName.value.trim()) return
  creating.value = true
  const result = await createWorkspace(newClientName.value.trim())
  creating.value = false
  if (result.success) {
    addToast('Client workspace created!', 'success')
    newClientName.value = ''
    showCreate.value = false
  } else {
    addToast(result.error || 'Failed to create client', 'error')
  }
}

const switchToClient = (ws: any) => {
  switchWorkspace(ws)
  router.push('/dashboard')
}

onMounted(() => loadWorkspaces())
</script>

<template>
  <div>
    <AppTopbar title="Client Management" subtitle="Manage workspaces for your clients and brands." />

    <div class="p-6 space-y-6">
      <!-- Toolbar -->
      <div class="flex items-center justify-between gap-4">
        <div class="relative flex-1 max-w-md">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search clients..."
            class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          class="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all"
          @click="showCreate = true"
        >
          <PlusIcon class="w-4 h-4" />
          Add Client
        </button>
      </div>

      <!-- Create Modal -->
      <Teleport to="body">
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="showCreate"
            class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            @click.self="showCreate = false"
          >
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Add New Client</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Client / Company Name</label>
                  <input
                    v-model="newClientName"
                    type="text"
                    placeholder="e.g. Acme Corp"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    @keydown.enter="handleCreate"
                    autofocus
                  />
                </div>
                <div class="flex gap-3">
                  <button
                    :disabled="creating || !newClientName.trim()"
                    class="flex-1 bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all"
                    @click="handleCreate"
                  >
                    {{ creating ? 'Creating...' : 'Create Workspace' }}
                  </button>
                  <button
                    class="px-6 py-3 text-gray-600 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all"
                    @click="showCreate = false"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Clients Grid -->
      <div v-if="filteredClients.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="ws in filteredClients"
          :key="ws.id"
          class="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-indigo-100 transition-all duration-200 cursor-pointer"
          @click="switchToClient(ws)"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span class="text-white text-lg font-bold">{{ ws.name.charAt(0).toUpperCase() }}</span>
            </div>
            <span class="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full"
              :class="ws.plan === 'pro' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-500'"
            >
              {{ ws.plan || 'Free' }}
            </span>
          </div>
          <h3 class="text-sm font-semibold text-gray-900 mb-1">{{ ws.name }}</h3>
          <p class="text-xs text-gray-500 mb-4">{{ ws.slug }}</p>

          <div class="flex items-center justify-between pt-3 border-t border-gray-100">
            <div class="flex items-center gap-1 text-xs text-gray-400">
              <ChartBarIcon class="w-3.5 h-3.5" />
              <span>{{ (ws as any).postCount || 0 }} posts</span>
            </div>
            <div class="flex items-center gap-1 text-xs text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
              <span>Open</span>
              <ArrowRightIcon class="w-3 h-3" />
            </div>
          </div>
        </div>

        <!-- Add client card -->
        <button
          class="border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center gap-3 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all min-h-[180px]"
          @click="showCreate = true"
        >
          <PlusIcon class="w-8 h-8 text-gray-400" />
          <span class="text-sm font-medium text-gray-500">Add Client</span>
        </button>
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-20">
        <div class="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6">
          <UserGroupIcon class="w-10 h-10 text-indigo-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Manage your clients</h3>
        <p class="text-sm text-gray-500 max-w-md text-center mb-6">
          Create separate workspaces for each client or brand. Manage their content, analytics, and social accounts independently.
        </p>
        <button
          class="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm"
          @click="showCreate = true"
        >
          <PlusIcon class="w-4 h-4" />
          Add Your First Client
        </button>
      </div>
    </div>
  </div>
</template>
