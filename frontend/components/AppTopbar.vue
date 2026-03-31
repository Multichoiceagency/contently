<script setup lang="ts">
import {
  MagnifyingGlassIcon,
  BellIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline'

defineProps<{
  title: string
  subtitle?: string
}>()

defineEmits<{
  (e: 'action'): void
}>()

const searchOpen = ref(false)
const searchQuery = ref('')
</script>

<template>
  <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
    <div>
      <h1 class="text-xl font-semibold text-gray-900">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm text-gray-500 mt-0.5">{{ subtitle }}</p>
    </div>

    <div class="flex items-center gap-3">
      <!-- Search -->
      <div class="relative">
        <div
          class="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 transition-all duration-200"
          :class="searchOpen ? 'w-64' : 'w-10 cursor-pointer'"
          @click="searchOpen = true"
        >
          <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            v-if="searchOpen"
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="bg-transparent text-sm text-gray-700 outline-none w-full"
            @blur="searchOpen = false"
          />
        </div>
      </div>

      <!-- Notifications -->
      <button class="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
        <BellIcon class="w-5 h-5" />
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      <!-- Action Button (slot) -->
      <slot name="action">
        <button
          class="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 transition-all duration-200 shadow-sm"
          @click="$emit('action')"
        >
          <PlusIcon class="w-4 h-4" />
          <span>Create Post</span>
        </button>
      </slot>
    </div>
  </header>
</template>
