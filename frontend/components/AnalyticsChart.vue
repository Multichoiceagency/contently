<script setup lang="ts">
import { Line, Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps<{
  type: 'line' | 'bar' | 'doughnut'
  data: any
  options?: any
  title?: string
  height?: number
}>()

const chartComponent = computed(() => {
  switch (props.type) {
    case 'line': return Line
    case 'bar': return Bar
    case 'doughnut': return Doughnut
    default: return Line
  }
})

const defaultOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: props.type === 'doughnut',
      position: 'bottom' as const,
    },
    tooltip: {
      backgroundColor: '#1e293b',
      titleFont: { family: 'Inter' },
      bodyFont: { family: 'Inter' },
      padding: 12,
      cornerRadius: 8,
    },
  },
  scales: props.type !== 'doughnut'
    ? {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Inter', size: 11 } },
        },
        y: {
          grid: { color: '#f1f5f9' },
          ticks: { font: { family: 'Inter', size: 11 } },
        },
      }
    : undefined,
  ...props.options,
}))
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 p-6">
    <h3 v-if="title" class="text-sm font-semibold text-gray-900 mb-4">{{ title }}</h3>
    <div :style="{ height: `${height || 280}px` }">
      <component
        :is="chartComponent"
        :data="data"
        :options="defaultOptions"
      />
    </div>
  </div>
</template>
