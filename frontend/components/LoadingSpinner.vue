<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <div class="flex items-center justify-center">
    <div
      class="border-2 border-gray-200 border-t-brand-500 rounded-full animate-spin"
      :class="{
        'w-5 h-5': size === 'sm',
        'w-8 h-8': !size || size === 'md',
        'w-12 h-12': size === 'lg',
      }"
    />
  </div>
</template>
