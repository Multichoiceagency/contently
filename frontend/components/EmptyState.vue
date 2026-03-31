<script setup lang="ts">
defineProps<{
  icon?: any
  title: string
  description?: string
  actionLabel?: string
}>()

defineEmits<{
  (e: 'action'): void
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4">
    <div v-if="icon" class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
      <component :is="icon" class="w-8 h-8 text-gray-400" />
    </div>
    <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ title }}</h3>
    <p v-if="description" class="text-sm text-gray-500 mb-6 text-center max-w-sm">
      {{ description }}
    </p>
    <button
      v-if="actionLabel"
      class="bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 transition-all duration-200"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>
