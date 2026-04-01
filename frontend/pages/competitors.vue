<script setup lang="ts">
import {
  RectangleStackIcon,
  PlusIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
} from '@heroicons/vue/24/outline'

const { addToast } = useToast()

const competitors = ref<any[]>([])
const showAdd = ref(false)
const newUrl = ref('')
</script>

<template>
  <div>
    <AppTopbar title="Competitor Analytics" subtitle="Track and benchmark against your competitors." />

    <div class="p-6 space-y-6">
      <!-- Toolbar -->
      <div class="flex items-center justify-between gap-4">
        <div class="relative flex-1 max-w-md">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="newUrl"
            type="text"
            placeholder="Search competitors..."
            class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          class="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all"
          @click="showAdd = true"
        >
          <PlusIcon class="w-4 h-4" />
          Add Competitor
        </button>
      </div>

      <!-- Empty State -->
      <div class="flex flex-col items-center justify-center py-20">
        <div class="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mb-6">
          <RectangleStackIcon class="w-10 h-10 text-purple-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Benchmark against competitors</h3>
        <p class="text-sm text-gray-500 max-w-md text-center mb-8">
          Track your competitors' social media activity, engagement rates, and content strategy. Stay ahead with data-driven insights.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
          <div class="flex flex-col items-center p-5 bg-white rounded-xl border border-gray-200 text-center">
            <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
              <ChartBarIcon class="w-5 h-5 text-blue-500" />
            </div>
            <p class="text-sm font-semibold text-gray-900 mb-1">Performance</p>
            <p class="text-xs text-gray-500">Compare engagement & growth metrics</p>
          </div>
          <div class="flex flex-col items-center p-5 bg-white rounded-xl border border-gray-200 text-center">
            <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-3">
              <ArrowTrendingUpIcon class="w-5 h-5 text-emerald-500" />
            </div>
            <p class="text-sm font-semibold text-gray-900 mb-1">Trends</p>
            <p class="text-xs text-gray-500">Spot content trends early</p>
          </div>
          <div class="flex flex-col items-center p-5 bg-white rounded-xl border border-gray-200 text-center">
            <div class="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-3">
              <GlobeAltIcon class="w-5 h-5 text-purple-500" />
            </div>
            <p class="text-sm font-semibold text-gray-900 mb-1">Strategy</p>
            <p class="text-xs text-gray-500">Analyze posting frequency & timing</p>
          </div>
        </div>

        <button
          class="mt-8 flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm"
          @click="showAdd = true"
        >
          <PlusIcon class="w-4 h-4" />
          Add Your First Competitor
        </button>
      </div>
    </div>
  </div>
</template>
