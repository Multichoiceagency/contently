<script setup lang="ts">
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/24/solid'

defineProps<{
  title: string
  value: string | number
  change?: number
  icon: any
  color?: string
}>()
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ value }}</p>
        <div v-if="change !== undefined" class="flex items-center gap-1 mt-2">
          <ArrowUpIcon v-if="change >= 0" class="w-3.5 h-3.5 text-green-500" />
          <ArrowDownIcon v-else class="w-3.5 h-3.5 text-red-500" />
          <span
            class="text-xs font-medium"
            :class="change >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            {{ Math.abs(change) }}%
          </span>
          <span class="text-xs text-gray-400">vs last month</span>
        </div>
      </div>
      <div
        class="w-10 h-10 rounded-lg flex items-center justify-center"
        :class="color || 'bg-brand-100'"
      >
        <component
          :is="icon"
          class="w-5 h-5"
          :class="color ? 'text-white' : 'text-brand-600'"
        />
      </div>
    </div>
  </div>
</template>
