<script setup lang="ts">
import {
  EyeIcon,
  CursorArrowRaysIcon,
  HeartIcon,
  UserPlusIcon,
  CalendarIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/vue/24/outline'

const dateRange = ref('30d')
const dateRanges = [
  { id: '7d', label: '7 days' },
  { id: '14d', label: '14 days' },
  { id: '30d', label: '30 days' },
  { id: '90d', label: '90 days' },
]

// Generate mock data
const generateDailyData = (days: number) => {
  const data = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    data.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      impressions: Math.floor(Math.random() * 5000 + 2000),
      clicks: Math.floor(Math.random() * 400 + 100),
      engagement: Math.floor(Math.random() * 300 + 50),
      followers: Math.floor(Math.random() * 50 + 10),
    })
  }
  return data
}

const dailyData = computed(() => {
  const days = parseInt(dateRange.value)
  return generateDailyData(days)
})

const kpis = computed(() => [
  {
    title: 'Impressions',
    value: '127.4K',
    change: 14,
    icon: EyeIcon,
    color: 'bg-blue-100',
  },
  {
    title: 'Clicks',
    value: '8,241',
    change: 8,
    icon: CursorArrowRaysIcon,
    color: 'bg-purple-100',
  },
  {
    title: 'Engagement',
    value: '4.2%',
    change: -2,
    icon: HeartIcon,
    color: 'bg-pink-100',
  },
  {
    title: 'Followers Growth',
    value: '+1,247',
    change: 22,
    icon: UserPlusIcon,
    color: 'bg-green-100',
  },
])

const metricsChartData = computed(() => {
  const data = dailyData.value
  return {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Impressions',
        data: data.map(d => d.impressions),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
      {
        label: 'Clicks',
        data: data.map(d => d.clicks),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.05)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
    ],
  }
})

const platformComparisonData = computed(() => ({
  labels: ['LinkedIn', 'Facebook', 'Twitter/X', 'Instagram'],
  datasets: [
    {
      label: 'Impressions',
      data: [42000, 35000, 28000, 22000],
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      borderRadius: 6,
    },
    {
      label: 'Engagement',
      data: [1800, 1200, 950, 1400],
      backgroundColor: 'rgba(139, 92, 246, 0.8)',
      borderRadius: 6,
    },
  ],
}))

const bestPosts = [
  { content: 'Excited to announce our new AI-powered dashboard...', platform: 'linkedin', impressions: 12400, engagement: '6.2%' },
  { content: 'Behind the scenes at our latest product photoshoot...', platform: 'instagram', impressions: 9800, engagement: '8.1%' },
  { content: '5 strategies that actually work in 2026...', platform: 'twitter', impressions: 7200, engagement: '5.4%' },
  { content: 'We just hit 10K followers! Thank you all...', platform: 'facebook', impressions: 6500, engagement: '7.8%' },
  { content: 'Customer spotlight: See how @TechStartup increased...', platform: 'linkedin', impressions: 5900, engagement: '4.9%' },
]

// Heatmap for best times
const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const heatmapData = days.map(() =>
  hours.map(() => Math.floor(Math.random() * 100))
)

const heatmapColor = (value: number) => {
  if (value > 80) return 'bg-brand-600 text-white'
  if (value > 60) return 'bg-brand-400 text-white'
  if (value > 40) return 'bg-brand-200'
  if (value > 20) return 'bg-brand-100'
  return 'bg-gray-100'
}

const aiInsights = [
  'Your LinkedIn posts perform 2.3x better than average when posted between 9-11 AM EST.',
  'Video content is getting 45% more engagement than image posts. Consider increasing video output.',
  'Posts with questions get 67% more comments. Try ending posts with a question.',
  'Your audience is most active on Tuesdays and Thursdays. Prioritize these days for important content.',
]
</script>

<template>
  <div>
    <AppTopbar title="Analytics" subtitle="Track your social media performance.">
      <template #action>
        <div class="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
          <button
            v-for="range in dateRanges"
            :key="range.id"
            class="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
            :class="
              dateRange === range.id
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            "
            @click="dateRange = range.id"
          >
            {{ range.label }}
          </button>
        </div>
      </template>
    </AppTopbar>

    <div class="p-6 space-y-6">
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          v-for="kpi in kpis"
          :key="kpi.title"
          :title="kpi.title"
          :value="kpi.value"
          :change="kpi.change"
          :icon="kpi.icon"
          :color="kpi.color"
        />
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <AnalyticsChart
            type="line"
            :data="metricsChartData"
            title="Performance Over Time"
            :height="320"
          />
        </div>
        <div>
          <AnalyticsChart
            type="bar"
            :data="platformComparisonData"
            title="Platform Comparison"
            :height="320"
          />
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Best Posts -->
        <div class="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-sm font-semibold text-gray-900">Best Performing Posts</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-100">
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Content</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Platform</th>
                  <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Impressions</th>
                  <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Engagement</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(post, i) in bestPosts" :key="i" class="hover:bg-gray-50 transition-all duration-200">
                  <td class="px-6 py-3">
                    <p class="text-sm text-gray-700 truncate max-w-xs">{{ post.content }}</p>
                  </td>
                  <td class="px-6 py-3">
                    <PlatformIcon :platform="(post.platform as any)" size="sm" />
                  </td>
                  <td class="px-6 py-3 text-right text-sm text-gray-700 font-medium">
                    {{ post.impressions.toLocaleString() }}
                  </td>
                  <td class="px-6 py-3 text-right">
                    <span class="text-sm text-green-600 font-medium">{{ post.engagement }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- AI Insights -->
        <div class="bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl p-6 text-white">
          <div class="flex items-center gap-2 mb-4">
            <SparklesIcon class="w-5 h-5" />
            <h3 class="text-sm font-semibold">AI Insights</h3>
          </div>
          <div class="space-y-3">
            <div
              v-for="(insight, index) in aiInsights"
              :key="index"
              class="bg-white/10 rounded-lg p-3"
            >
              <div class="flex items-start gap-2">
                <ArrowTrendingUpIcon class="w-4 h-4 flex-shrink-0 mt-0.5 text-brand-200" />
                <p class="text-sm text-white/90 leading-relaxed">{{ insight }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Heatmap -->
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">Best Times to Post</h3>
        <div class="overflow-x-auto">
          <div class="min-w-[800px]">
            <!-- Hours header -->
            <div class="flex items-center gap-1 mb-1 ml-12">
              <div
                v-for="(hour, i) in hours"
                :key="hour"
                class="w-6 text-[9px] text-gray-400 text-center"
              >
                {{ i % 3 === 0 ? hour.split(':')[0] : '' }}
              </div>
            </div>
            <!-- Grid -->
            <div v-for="(day, dayIdx) in days" :key="day" class="flex items-center gap-1 mb-1">
              <span class="w-10 text-xs text-gray-500 text-right mr-1">{{ day }}</span>
              <div
                v-for="(value, hourIdx) in heatmapData[dayIdx]"
                :key="hourIdx"
                :class="heatmapColor(value)"
                class="w-6 h-6 rounded-sm transition-all duration-200 cursor-pointer hover:ring-2 hover:ring-brand-300"
                :title="`${day} ${hours[hourIdx]}: ${value}% engagement`"
              />
            </div>
            <!-- Legend -->
            <div class="flex items-center gap-2 mt-3 ml-12">
              <span class="text-[10px] text-gray-400">Less</span>
              <div class="w-4 h-4 bg-gray-100 rounded-sm" />
              <div class="w-4 h-4 bg-brand-100 rounded-sm" />
              <div class="w-4 h-4 bg-brand-200 rounded-sm" />
              <div class="w-4 h-4 bg-brand-400 rounded-sm" />
              <div class="w-4 h-4 bg-brand-600 rounded-sm" />
              <span class="text-[10px] text-gray-400">More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
