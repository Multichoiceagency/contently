<script setup lang="ts">
import { ChevronUpDownIcon, CheckIcon, PlusIcon } from '@heroicons/vue/24/outline'

const { workspaces, current, loadWorkspaces, switchWorkspace, createWorkspace } = useWorkspace()
const { addToast } = useToast()

const open = ref(false)
const showCreate = ref(false)
const newName = ref('')
const creating = ref(false)

onMounted(() => {
  loadWorkspaces()
})

const handleCreate = async () => {
  if (!newName.value.trim()) return
  creating.value = true
  const result = await createWorkspace(newName.value.trim())
  creating.value = false
  if (result.success) {
    addToast('Workspace created!', 'success')
    newName.value = ''
    showCreate.value = false
    open.value = false
  } else {
    addToast(result.error || 'Failed to create workspace', 'error')
  }
}
</script>

<template>
  <div class="relative">
    <button
      class="w-full flex items-center gap-2 px-3 py-2 bg-slate-800/60 rounded-lg text-sm text-slate-200 hover:bg-slate-800 transition-all duration-200"
      @click="open = !open"
    >
      <div class="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center flex-shrink-0">
        <span class="text-white text-[10px] font-bold">
          {{ current?.name?.charAt(0)?.toUpperCase() || 'W' }}
        </span>
      </div>
      <span class="flex-1 text-left truncate">{{ current?.name || 'Select Workspace' }}</span>
      <ChevronUpDownIcon class="w-4 h-4 text-slate-400 flex-shrink-0" />
    </button>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="open"
        class="absolute left-0 right-0 top-full mt-1 bg-slate-800 rounded-lg shadow-lg border border-white/10 py-1 z-50"
      >
        <button
          v-for="ws in workspaces"
          :key="ws.id"
          class="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200"
          @click="switchWorkspace(ws); open = false"
        >
          <div class="w-6 h-6 bg-indigo-600/60 rounded flex items-center justify-center flex-shrink-0">
            <span class="text-white text-[10px] font-bold">
              {{ ws.name.charAt(0).toUpperCase() }}
            </span>
          </div>
          <span class="flex-1 text-left truncate">{{ ws.name }}</span>
          <CheckIcon v-if="current?.id === ws.id" class="w-4 h-4 text-indigo-400" />
        </button>

        <!-- Create new workspace -->
        <div class="border-t border-white/10 mt-1 pt-1">
          <template v-if="!showCreate">
            <button
              class="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:bg-slate-700 hover:text-white transition-all duration-200"
              @click="showCreate = true"
            >
              <PlusIcon class="w-4 h-4" />
              <span>New Workspace</span>
            </button>
          </template>
          <template v-else>
            <div class="px-3 py-2 space-y-2">
              <input
                v-model="newName"
                type="text"
                placeholder="Workspace name"
                class="w-full px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-md text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                @keydown.enter="handleCreate"
                @keydown.escape="showCreate = false"
                autofocus
              />
              <div class="flex gap-2">
                <button
                  :disabled="creating || !newName.trim()"
                  class="flex-1 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-all"
                  @click="handleCreate"
                >
                  {{ creating ? 'Creating...' : 'Create' }}
                </button>
                <button
                  class="px-3 py-1.5 text-slate-400 text-xs hover:text-white transition-all"
                  @click="showCreate = false; newName = ''"
                >
                  Cancel
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </Transition>

    <!-- Click outside to close -->
    <div v-if="open" class="fixed inset-0 z-40" @click="open = false; showCreate = false" />
  </div>
</template>
