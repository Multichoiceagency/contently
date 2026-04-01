<script setup lang="ts">
import {
  EyeIcon,
  CursorArrowRaysIcon,
  HeartIcon,
  UserPlusIcon,
  CalendarIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowDownTrayIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  LightBulbIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  FireIcon,
} from '@heroicons/vue/24/outline'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/24/solid'

const dateRange = ref('30d')
const dateRanges = [
  { id: '7d', label: '7d' },
  { id: '30d', label: '30d' },
  { id: '90d', label: '90d' },
]
const customDateOpen = ref(false)
const customStart = ref('')
const customEnd = ref('')
const exportOpen = ref(false)

// Empty data — will be populated from API when analytics backend is connected
const generateDailyData = (days: number) => {
  const data = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    data.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      impressions: 0,
      clicks: 0,
      engagement: 0,
      followers: 0,
    })
  }
  return data
}

const dailyData = computed(() => {
  const days = parseInt(dateRange.value)
  return generateDailyData(days)
})

// Sparkline data for KPI cards
const generateSparkline = (trend: 'up' | 'down' | 'flat', count: number = 14) => {
  const data = []
  let base = 50
  for (let i = 0; i < count; i++) {
    if (trend === 'up') base += Math.random() * 8 - 2
    else if (trend === 'down') base += Math.random() * 4 - 6
    else base += Math.random() * 6 - 3
    data.push(Math.max(10, Math.min(100, base)))
  }
  return data
}

const kpis = computed(() => [
  {
    title: 'Impressions',
    value: '127.4K',
    change: 14,
    prevValue: '111.8K',
    icon: EyeIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    sparklineColor: '#3b82f6',
    sparkline: generateSparkline('up'),
  },
  {
    title: 'Clicks',
    value: '8,241',
    change: 8,
    prevValue: '7,630',
    icon: CursorArrowRaysIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    sparklineColor: '#9333ea',
    sparkline: generateSparkline('up'),
  },
  {
    title: 'Engagement',
    value: '4.2%',
    change: -2,
    prevValue: '4.3%',
    icon: HeartIcon,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    sparklineColor: '#ec4899',
    sparkline: generateSparkline('down'),
  },
  {
    title: 'Followers Growth',
    value: '+1,247',
    change: 22,
    prevValue: '+1,022',
    icon: UserPlusIcon,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    sparklineColor: '#10b981',
    sparkline: generateSparkline('up'),
  },
])

// Generate SVG sparkline path
const sparklinePath = (data: number[], width: number = 100, height: number = 32) => {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1)

  const points = data.map((v, i) => ({
    x: i * stepX,
    y: height - ((v - min) / range) * height * 0.8 - height * 0.1,
  }))

  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpx1 = prev.x + stepX * 0.4
    const cpx2 = curr.x - stepX * 0.4
    d += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`
  }

  // Area fill path
  const areaD = d + ` L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`

  return { line: d, area: areaD }
}

const metricsChartData = computed(() => {
  const data = dailyData.value
  return {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Impressions',
        data: data.map(d => d.impressions),
        borderColor: '#6366f1',
        backgroundColor: (ctx: any) => {
          if (!ctx?.chart?.ctx) return 'rgba(99, 102, 241, 0.05)'
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height)
          gradient.addColorStop(0, 'rgba(99, 102, 241, 0.15)')
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0)')
          return gradient
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#6366f1',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        borderWidth: 2,
      },
      {
        label: 'Clicks',
        data: data.map(d => d.clicks),
        borderColor: '#a855f7',
        backgroundColor: (ctx: any) => {
          if (!ctx?.chart?.ctx) return 'rgba(168, 85, 247, 0.05)'
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height)
          gradient.addColorStop(0, 'rgba(168, 85, 247, 0.1)')
          gradient.addColorStop(1, 'rgba(168, 85, 247, 0)')
          return gradient
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#a855f7',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        borderWidth: 2,
      },
    ],
  }
})

const metricsChartOptions = {
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    tooltip: {
      backgroundColor: '#ffffff',
      titleColor: '#1e293b',
      bodyColor: '#475569',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 12,
      titleFont: { family: 'Inter', weight: '600' as const, size: 13 },
      bodyFont: { family: 'Inter', size: 12 },
      boxPadding: 4,
      usePointStyle: true,
      caretSize: 6,
    },
  },
  animation: {
    duration: 800,
    easing: 'easeOutQuart' as const,
  },
}

const platformComparisonData = computed(() => ({
  labels: ['LinkedIn', 'Facebook', 'Twitter/X', 'Instagram'],
  datasets: [
    {
      label: 'Impressions',
      data: [42000, 35000, 28000, 22000],
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      hoverBackgroundColor: 'rgba(99, 102, 241, 1)',
      borderRadius: 8,
      borderSkipped: false,
    },
    {
      label: 'Engagement',
      data: [1800, 1200, 950, 1400],
      backgroundColor: 'rgba(168, 85, 247, 0.8)',
      hoverBackgroundColor: 'rgba(168, 85, 247, 1)',
      borderRadius: 8,
      borderSkipped: false,
    },
  ],
}))

const bestPosts = [
  {
    content: 'Excited to announce our new AI-powered dashboard...',
    platform: 'linkedin',
    impressions: 12400,
    engagement: '6.2%',
    likes: 342,
    comments: 47,
    color: 'from-blue-500/10 to-indigo-500/5',
  },
  {
    content: 'Behind the scenes at our latest product photoshoot...',
    platform: 'instagram',
    impressions: 9800,
    engagement: '8.1%',
    likes: 891,
    comments: 63,
    color: 'from-pink-500/10 to-rose-500/5',
  },
  {
    content: '5 strategies that actually work in 2026...',
    platform: 'twitter',
    impressions: 7200,
    engagement: '5.4%',
    likes: 278,
    comments: 34,
    color: 'from-sky-500/10 to-blue-500/5',
  },
  {
    content: 'We just hit 10K followers! Thank you all...',
    platform: 'facebook',
    impressions: 6500,
    engagement: '7.8%',
    likes: 512,
    comments: 89,
    color: 'from-blue-600/10 to-indigo-600/5',
  },
]

// Heatmap for best times with more realistic data
const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Generate more realistic heatmap: higher engagement during business hours
const heatmapData = days.map((_, dayIdx) =>
  hours.map((_, hourIdx) => {
    const isWeekday = dayIdx < 5
    const isBusinessHour = hourIdx >= 9 && hourIdx <= 17
    const isPeakHour = hourIdx >= 10 && hourIdx <= 14
    let base = Math.floor(Math.random() * 20)
    if (isWeekday && isBusinessHour) base += 30
    if (isWeekday && isPeakHour) base += 30
    if (!isWeekday && hourIdx >= 10 && hourIdx <= 16) base += 20
    return Math.min(base + Math.floor(Math.random() * 15), 100)
  })
)

const heatmapColor = (value: number) => {
  if (value > 80) return 'bg-emerald-600'
  if (value > 60) return 'bg-emerald-500'
  if (value > 40) return 'bg-emerald-300'
  if (value > 20) return 'bg-emerald-100'
  return 'bg-gray-50'
}

const heatmapTextColor = (value: number) => {
  return value > 60 ? 'text-white' : 'text-transparent'
}

const aiInsights = [
  { icon: ClockIcon, text: 'Your LinkedIn posts perform 2.3x better when posted between 9-11 AM EST.', type: 'timing' },
  { icon: FireIcon, text: 'Video content is getting 45% more engagement than image posts. Consider increasing video output.', type: 'content' },
  { icon: ChatBubbleLeftRightIcon, text: 'Posts with questions get 67% more comments. Try ending posts with a question.', type: 'engagement' },
  { icon: ArrowTrendingUpIcon, text: 'Your audience is most active on Tuesdays and Thursdays. Prioritize these days.', type: 'growth' },
]

const handleExport = (format: string) => {
  exportOpen.value = false
  // Mock export
}
</script>

<template>
  <div>
    <AppTopbar title="Analytics" subtitle="Track your social media performance.">
      <template #action>
        <div class="flex items-center gap-3">
          <!-- Export Button -->
          <div class="relative">
            <button
              class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
              @click="exportOpen = !exportOpen"
            >
              <ArrowDownTrayIcon class="w-4 h-4" />
              Export
            </button>
            <div
              v-if="exportOpen"
              class="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden"
            >
              <button
                class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-all"
                @click="handleExport('csv')"
              >
                <span class="w-6 h-6 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">CSV</span>
                Export CSV
              </button>
              <button
                class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-all"
                @click="handleExport('pdf')"
              >
                <span class="w-6 h-6 rounded bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold">PDF</span>
                Export PDF
              </button>
            </div>
          </div>

          <!-- Date Range Picker -->
          <div class="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
            <button
              v-for="range in dateRanges"
              :key="range.id"
              class="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
              :class="
                dateRange === range.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              "
              @click="dateRange = range.id"
            >
              {{ range.label }}
            </button>
            <button
              class="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1"
              :class="customDateOpen ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'"
              @click="customDateOpen = !customDateOpen"
            >
              <CalendarIcon class="w-3.5 h-3.5" />
              Custom
            </button>
          </div>
        </div>
      </template>
    </AppTopbar>

    <div class="p-6 space-y-6">
      <!-- KPI Cards with Sparklines -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="kpi in kpis"
          :key="kpi.title"
          class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-300 group"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ kpi.title }}</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ kpi.value }}</p>
            </div>
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
              :class="kpi.bgColor"
            >
              <component :is="kpi.icon" class="w-5 h-5" :class="kpi.color" />
            </div>
          </div>

          <!-- Sparkline Mini Chart -->
          <div class="mb-3">
            <svg width="100%" height="32" viewBox="0 0 100 32" preserveAspectRatio="none">
              <defs>
                <linearGradient :id="`sparkline-gradient-${kpi.title}`" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" :stop-color="kpi.sparklineColor" stop-opacity="0.2" />
                  <stop offset="100%" :stop-color="kpi.sparklineColor" stop-opacity="0" />
                </linearGradient>
              </defs>
              <path
                :d="sparklinePath(kpi.sparkline).area"
                :fill="`url(#sparkline-gradient-${kpi.title})`"
              />
              <path
                :d="sparklinePath(kpi.sparkline).line"
                fill="none"
                :stroke="kpi.sparklineColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </div>

          <!-- Comparison with previous period -->
          <div class="flex items-center gap-2">
            <div
              class="flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded"
              :class="kpi.change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'"
            >
              <component :is="kpi.change >= 0 ? ArrowUpIcon : ArrowDownIcon" class="w-3 h-3" />
              {{ Math.abs(kpi.change) }}%
            </div>
            <span class="text-[11px] text-gray-400">vs previous {{ dateRange }}</span>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <AnalyticsChart
            type="line"
            :data="metricsChartData"
            :options="metricsChartOptions"
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

      <!-- Best Performing Posts as Cards -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-gray-900">Best Performing Posts</h3>
          <span class="text-xs text-gray-400">Last {{ dateRange }}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="(post, i) in bestPosts"
            :key="i"
            class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group"
          >
            <!-- Top gradient bar -->
            <div class="h-1 bg-gradient-to-r" :class="post.color.replace(/\/\d+/g, '')" />
            <div class="p-5">
              <div class="flex items-start gap-3 mb-4">
                <PlatformIcon :platform="(post.platform as any)" size="md" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-800 font-medium leading-relaxed line-clamp-2">{{ post.content }}</p>
                </div>
              </div>

              <div class="grid grid-cols-4 gap-3 pt-3 border-t border-gray-100">
                <div class="text-center">
                  <p class="text-xs text-gray-400">Impressions</p>
                  <p class="text-sm font-bold text-gray-900">{{ post.impressions.toLocaleString() }}</p>
                </div>
                <div class="text-center">
                  <p class="text-xs text-gray-400">Engagement</p>
                  <p class="text-sm font-bold text-emerald-600">{{ post.engagement }}</p>
                </div>
                <div class="text-center">
                  <p class="text-xs text-gray-400">Likes</p>
                  <p class="text-sm font-bold text-gray-900">{{ post.likes }}</p>
                </div>
                <div class="text-center">
                  <p class="text-xs text-gray-400">Comments</p>
                  <p class="text-sm font-bold text-gray-900">{{ post.comments }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Section: Heatmap + AI Insights -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Heatmap -->
        <div class="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h3 class="text-sm font-semibold text-gray-900">Best Times to Post</h3>
              <p class="text-xs text-gray-400 mt-0.5">Engagement heatmap based on your audience activity</p>
            </div>
          </div>
          <div class="overflow-x-auto">
            <div class="min-w-[700px]">
              <!-- Hours header -->
              <div class="flex items-center gap-[3px] mb-1 ml-12">
                <div
                  v-for="(hour, i) in hours"
                  :key="hour"
                  class="w-[26px] text-[9px] text-gray-400 text-center"
                >
                  {{ i % 3 === 0 ? hour.split(':')[0] : '' }}
                </div>
              </div>
              <!-- Grid -->
              <div v-for="(day, dayIdx) in days" :key="day" class="flex items-center gap-[3px] mb-[3px]">
                <span class="w-10 text-xs text-gray-500 text-right mr-1 font-medium">{{ day }}</span>
                <div
                  v-for="(value, hourIdx) in heatmapData[dayIdx]"
                  :key="hourIdx"
                  :class="[heatmapColor(value), heatmapTextColor(value)]"
                  class="w-[26px] h-[26px] rounded transition-all duration-200 cursor-pointer hover:ring-2 hover:ring-emerald-300 hover:scale-110 flex items-center justify-center text-[8px] font-bold"
                  :title="`${day} ${hours[hourIdx]}: ${value}% engagement`"
                >
                  {{ value > 60 ? value : '' }}
                </div>
              </div>
              <!-- Legend -->
              <div class="flex items-center gap-2 mt-4 ml-12">
                <span class="text-[10px] text-gray-400 font-medium">Less</span>
                <div class="w-5 h-5 bg-gray-50 rounded" />
                <div class="w-5 h-5 bg-emerald-100 rounded" />
                <div class="w-5 h-5 bg-emerald-300 rounded" />
                <div class="w-5 h-5 bg-emerald-500 rounded" />
                <div class="w-5 h-5 bg-emerald-600 rounded" />
                <span class="text-[10px] text-gray-400 font-medium">More</span>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Insights -->
        <div class="relative overflow-hidden rounded-xl border border-indigo-100 bg-white">
          <!-- Gradient accent top border -->
          <div class="h-1 bg-gradient-to-r from-indigo-500 to-purple-600" />
          <div class="p-6">
            <div class="flex items-center gap-2 mb-5">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <SparklesIcon class="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-gray-900">AI Insights</h3>
                <p class="text-[10px] text-gray-400">Based on your last {{ dateRange }} of data</p>
              </div>
            </div>
            <div class="space-y-3">
              <div
                v-for="(insight, index) in aiInsights"
                :key="index"
                class="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-indigo-50/50 transition-all duration-200 group"
              >
                <div class="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:border-indigo-200 transition-colors">
                  <component :is="insight.icon" class="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <p class="text-sm text-gray-600 leading-relaxed">{{ insight.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
