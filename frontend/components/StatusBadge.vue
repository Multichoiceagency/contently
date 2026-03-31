<script setup lang="ts">
import type { PostStatus } from '~/types'

const props = defineProps<{
  status: PostStatus
}>()

const config = computed(() => {
  const configs: Record<PostStatus, { label: string; classes: string }> = {
    draft: {
      label: 'Draft',
      classes: 'bg-gray-100 text-gray-600',
    },
    scheduled: {
      label: 'Scheduled',
      classes: 'bg-amber-100 text-amber-700',
    },
    published: {
      label: 'Published',
      classes: 'bg-green-100 text-green-700',
    },
    failed: {
      label: 'Failed',
      classes: 'bg-red-100 text-red-700',
    },
  }
  return configs[props.status]
})
</script>

<template>
  <span
    :class="config.classes"
    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
  >
    {{ config.label }}
  </span>
</template>
