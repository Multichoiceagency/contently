<script setup lang="ts">
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/vue/24/outline'

const { workspaces, current, loadWorkspaces, switchWorkspace } = useWorkspace()

const open = ref(false)

onMounted(() => {
  loadWorkspaces()
})
</script>

<template>
  <div class="relative">
    <button
      class="w-full flex items-center gap-2 px-3 py-2 bg-sidebar-hover rounded-lg text-sm text-sidebar-text-active hover:bg-sidebar-active transition-all duration-200"
      @click="open = !open"
    >
      <div class="w-6 h-6 bg-brand-600 rounded flex items-center justify-center flex-shrink-0">
        <span class="text-white text-[10px] font-bold">
          {{ current?.name?.charAt(0)?.toUpperCase() || 'W' }}
        </span>
      </div>
      <span class="flex-1 text-left truncate">{{ current?.name || 'Select Workspace' }}</span>
      <ChevronUpDownIcon class="w-4 h-4 text-sidebar-text flex-shrink-0" />
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
          class="w-full flex items-center gap-2 px-3 py-2 text-sm text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active transition-all duration-200"
          @click="switchWorkspace(ws); open = false"
        >
          <div class="w-6 h-6 bg-brand-600/60 rounded flex items-center justify-center flex-shrink-0">
            <span class="text-white text-[10px] font-bold">
              {{ ws.name.charAt(0).toUpperCase() }}
            </span>
          </div>
          <span class="flex-1 text-left truncate">{{ ws.name }}</span>
          <CheckIcon v-if="current?.id === ws.id" class="w-4 h-4 text-brand-400" />
        </button>
      </div>
    </Transition>

    <!-- Click outside to close -->
    <div v-if="open" class="fixed inset-0 z-40" @click="open = false" />
  </div>
</template>
