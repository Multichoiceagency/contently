<script setup lang="ts">
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  PlusIcon,
  CalendarDaysIcon,
} from '@heroicons/vue/24/outline'
import { usePostsStore } from '~/stores/posts'

const postsStore = usePostsStore()
const router = useRouter()
const { user } = useAuth()
const showPostModal = ref(false)

onMounted(() => {
  postsStore.loadPosts()
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})

const firstName = computed(() => {
  return user.value?.name?.split(' ')[0] || 'there'
})

const stats = computed(() => [
  {
    title: 'Total Posts',
    value: postsStore.posts.length,
    change: 12,
    icon: DocumentTextIcon,
    gradient: 'bg-gradient-to-br from-purple-600 to-purple-700',
  },
  {
    title: 'Scheduled',
    value: postsStore.scheduledCount,
    change: 5,
    icon: ClockIcon,
    gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
  },
  {
    title: 'Published',
    value: postsStore.publishedCount,
    change: 18,
    icon: CheckCircleIcon,
    gradient: 'bg-gradient-to-br from-emerald-500 to-green-600',
  },
  {
    title: 'Engagement Rate',
    value: '4.2%',
    change: -2,
    icon: ChartBarIcon,
    gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600',
  },
])

// Chart data
const engagementChartData = computed(() => {
  const labels = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })

  return {
    labels,
    datasets: [
      {
        label: 'Engagement',
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 400 + 100)),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 2,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#6366f1',
      },
    ],
  }
})

const platformChartData = computed(() => ({
  labels: ['LinkedIn', 'Facebook', 'Twitter/X', 'Instagram'],
  datasets: [
    {
      label: 'Posts',
      data: [
        postsStore.posts.filter(p => p.platforms.includes('linkedin')).length,
        postsStore.posts.filter(p => p.platforms.includes('facebook')).length,
        postsStore.posts.filter(p => p.platforms.includes('twitter')).length,
        postsStore.posts.filter(p => p.platforms.includes('instagram')).length,
      ],
      backgroundColor: ['#0077B5', '#1877F2', '#1DA1F2', '#E4405F'],
      borderRadius: 8,
      barThickness: 40,
    },
  ],
}))

const recentPosts = computed(() => {
  return postsStore.posts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)
})

const aiSuggestions = [
  'Your LinkedIn posts perform best on Tuesdays at 10 AM. Consider scheduling more content then.',
  'Visual content gets 2.3x more engagement on Instagram. Try adding more images.',
  'Your audience engages most with industry insights. Create more thought leadership content.',
]

const handleCreatePost = (data: any) => {
  const newPost = {
    id: Date.now().toString(),
    content: data.content,
    platforms: data.platforms,
    status: data.status,
    scheduledAt: data.scheduledAt,
    publishedAt: undefined,
    mediaUrls: [],
    engagement: { likes: 0, comments: 0, shares: 0, clicks: 0, impressions: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  postsStore.addPost(newPost)
}
</script>

<template>
  <div>
    <AppTopbar title="Dashboard" subtitle="Welcome back! Here's your social media overview." @action="showPostModal = true" />

    <div class="p-6 space-y-6">
      <!-- Welcome Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ greeting }}, {{ firstName }} <span class="inline-block animate-wave origin-[70%_70%]">&#128075;</span>
          </h1>
          <p class="text-sm text-gray-500 mt-1">Here's what's happening with your content</p>
        </div>

        <!-- Quick Actions -->
        <div class="flex items-center gap-3">
          <button
            class="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all duration-200"
            @click="showPostModal = true"
          >
            <PlusIcon class="w-4 h-4" />
            New Post
          </button>
          <button
            class="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-purple-700 hover:to-indigo-700 shadow-sm shadow-purple-600/20 transition-all duration-200"
            @click="router.push('/ai')"
          >
            <SparklesIcon class="w-4 h-4" />
            AI Generate
          </button>
          <button
            class="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all duration-200"
            @click="router.push('/calendar')"
          >
            <CalendarDaysIcon class="w-4 h-4" />
            View Calendar
          </button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          v-for="stat in stats"
          :key="stat.title"
          :title="stat.title"
          :value="stat.value"
          :change="stat.change"
          :icon="stat.icon"
          :gradient="stat.gradient"
        />
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <AnalyticsChart
            type="line"
            :data="engagementChartData"
            title="Engagement Over Time"
            :height="300"
          />
        </div>
        <div>
          <AnalyticsChart
            type="bar"
            :data="platformChartData"
            title="Posts by Platform"
            :height="300"
          />
        </div>
      </div>

      <!-- Bottom Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Posts -->
        <div class="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 class="text-sm font-semibold text-gray-900">Recent Posts</h3>
            <NuxtLink to="/posts" class="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
              View All
            </NuxtLink>
          </div>
          <div class="divide-y divide-gray-100">
            <div
              v-for="post in recentPosts"
              :key="post.id"
              class="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/80 transition-all duration-200 cursor-pointer"
              @click="router.push(`/posts/${post.id}`)"
            >
              <div class="flex items-center gap-1.5 flex-shrink-0">
                <PlatformIcon
                  v-for="platform in post.platforms"
                  :key="platform"
                  :platform="platform"
                  size="xs"
                />
              </div>
              <p class="text-sm text-gray-700 flex-1 truncate">{{ post.content }}</p>
              <StatusBadge :status="post.status" />
              <span class="text-xs text-gray-400 flex-shrink-0 w-20 text-right">
                {{ new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
              </span>
            </div>
          </div>
        </div>

        <!-- AI Insights -->
        <div class="relative overflow-hidden rounded-xl p-[2px] bg-gradient-to-br from-indigo-500 to-purple-500">
          <div class="bg-white rounded-[10px] p-6 h-full">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <SparklesIcon class="w-4 h-4 text-white" />
              </div>
              <h3 class="text-sm font-semibold text-gray-900">AI Insights</h3>
            </div>
            <div class="space-y-3">
              <div
                v-for="(suggestion, index) in aiSuggestions"
                :key="index"
                class="bg-gray-50 rounded-lg p-3 border border-gray-100"
              >
                <div class="flex items-start gap-2.5">
                  <ArrowTrendingUpIcon class="w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-500" />
                  <p class="text-sm text-gray-600 leading-relaxed">{{ suggestion }}</p>
                </div>
              </div>
            </div>
            <button
              class="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm shadow-indigo-600/20"
              @click="router.push('/ai')"
            >
              Generate Content
            </button>
          </div>
        </div>
      </div>
    </div>

    <PostModal v-model="showPostModal" @save="handleCreatePost" />
  </div>
</template>

<style scoped>
@keyframes wave {
  0% { transform: rotate(0deg); }
  10% { transform: rotate(14deg); }
  20% { transform: rotate(-8deg); }
  30% { transform: rotate(14deg); }
  40% { transform: rotate(-4deg); }
  50% { transform: rotate(10deg); }
  60% { transform: rotate(0deg); }
  100% { transform: rotate(0deg); }
}
.animate-wave {
  animation: wave 2.5s infinite;
  display: inline-block;
}
</style>
