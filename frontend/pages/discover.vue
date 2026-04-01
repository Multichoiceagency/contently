<script setup lang="ts">
import {
  MagnifyingGlassIcon,
  RssIcon,
  PlusIcon,
  GlobeAltIcon,
  HashtagIcon,
  ArrowTopRightOnSquareIcon,
  BookmarkIcon,
} from '@heroicons/vue/24/outline'

const { addToast } = useToast()

const searchQuery = ref('')
const activeTab = ref('feeds')
const feeds = ref<any[]>([])
const savedItems = ref<any[]>([])

const tabs = [
  { id: 'feeds', label: 'Feeds' },
  { id: 'trending', label: 'Trending' },
  { id: 'saved', label: 'Saved' },
]
</script>

<template>
  <div>
    <AppTopbar title="Discover" subtitle="Monitor feeds, trending topics, and industry news." />

    <div class="p-6 space-y-6">
      <!-- Search & Tabs -->
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
            :class="activeTab === tab.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="relative flex-1 max-w-md">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search topics, hashtags, or URLs..."
            class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button class="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all">
          <PlusIcon class="w-4 h-4" />
          Add Feed
        </button>
      </div>

      <!-- Empty State -->
      <div class="flex flex-col items-center justify-center py-20">
        <div class="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6">
          <RssIcon class="w-10 h-10 text-indigo-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Stay on top of your industry</h3>
        <p class="text-sm text-gray-500 max-w-md text-center mb-8">
          Add RSS feeds, monitor hashtags, and track trending topics. Get inspired for your next content piece.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
          <button class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all text-left group">
            <div class="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <RssIcon class="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900">RSS Feeds</p>
              <p class="text-xs text-gray-500">Follow blogs & news</p>
            </div>
          </button>
          <button class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all text-left group">
            <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <HashtagIcon class="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900">Hashtags</p>
              <p class="text-xs text-gray-500">Track trending tags</p>
            </div>
          </button>
          <button class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all text-left group">
            <div class="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <GlobeAltIcon class="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900">Keywords</p>
              <p class="text-xs text-gray-500">Monitor mentions</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
