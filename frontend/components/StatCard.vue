<script setup lang="ts">
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/24/solid'

defineProps<{
  title: string
  value: string | number
  change?: number
  icon: any
  color?: string
  gradient?: string
}>()
</script>

<template>
  <div
    class="relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
    :class="gradient || 'bg-white border border-gray-200'"
  >
    <!-- Background decorative element -->
    <div
      v-if="gradient"
      class="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 -translate-y-8 translate-x-8 bg-white/10 blur-2xl"
    />

    <div class="relative flex items-start justify-between">
      <div>
        <p class="text-sm font-medium" :class="gradient ? 'text-white/80' : 'text-gray-500'">{{ title }}</p>
        <p class="text-3xl font-bold mt-1" :class="gradient ? 'text-white' : 'text-gray-900'">{{ value }}</p>
        <div v-if="change !== undefined" class="flex items-center gap-1 mt-2">
          <div
            class="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-medium"
            :class="gradient
              ? (change >= 0 ? 'bg-white/20 text-white' : 'bg-white/20 text-white')
              : (change >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')
            "
          >
            <ArrowUpIcon v-if="change >= 0" class="w-3 h-3" />
            <ArrowDownIcon v-else class="w-3 h-3" />
            {{ Math.abs(change) }}%
          </div>
          <span class="text-xs" :class="gradient ? 'text-white/60' : 'text-gray-400'">vs last month</span>
        </div>
      </div>
      <div
        class="w-11 h-11 rounded-xl flex items-center justify-center"
        :class="gradient ? 'bg-white/20 backdrop-blur-sm' : (color || 'bg-brand-100')"
      >
        <component
          :is="icon"
          class="w-5 h-5"
          :class="gradient ? 'text-white' : (color ? 'text-white' : 'text-brand-600')"
        />
      </div>
    </div>
  </div>
</template>
