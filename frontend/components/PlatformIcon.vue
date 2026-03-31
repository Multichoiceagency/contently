<script setup lang="ts">
import type { Platform } from '~/types'

const props = defineProps<{
  platform: Platform
  size?: 'xs' | 'sm' | 'md' | 'lg'
}>()

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs': return 'w-5 h-5 text-[10px]'
    case 'sm': return 'w-6 h-6 text-xs'
    case 'lg': return 'w-10 h-10 text-lg'
    default: return 'w-8 h-8 text-sm'
  }
})

const platformConfig = computed(() => {
  const configs: Record<Platform, { bg: string; label: string; initial: string }> = {
    linkedin: { bg: 'bg-[#0077B5]', label: 'LinkedIn', initial: 'Li' },
    facebook: { bg: 'bg-[#1877F2]', label: 'Facebook', initial: 'Fb' },
    twitter: { bg: 'bg-[#1DA1F2]', label: 'Twitter/X', initial: 'X' },
    instagram: { bg: 'bg-[#E4405F]', label: 'Instagram', initial: 'Ig' },
  }
  return configs[props.platform]
})
</script>

<template>
  <div
    :class="[sizeClasses, platformConfig.bg]"
    class="rounded flex items-center justify-center flex-shrink-0"
    :title="platformConfig.label"
  >
    <span class="text-white font-bold">{{ platformConfig.initial }}</span>
  </div>
</template>
