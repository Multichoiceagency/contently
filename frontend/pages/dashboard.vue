<script setup lang="ts">
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/vue/24/outline'
import { usePostsStore } from '~/stores/posts'

const postsStore = usePostsStore()
const router = useRouter()
const showPostModal = ref(false)

onMounted(() => {
  postsStore.loadPosts()
})

const stats = computed(() => [
  {
    title: 'Total Posts',
    value: postsStore.posts.length,
    change: 12,
    icon: DocumentTextIcon,
    color: 'bg-brand-100',
  },
  {
    title: 'Scheduled',
    value: postsStore.scheduledCount,
    change: 5,
    icon: ClockIcon,
    color: 'bg-amber-100',
  },
  {
    title: 'Published',
    value: postsStore.publishedCount,
    change: 18,
    icon: CheckCircleIcon,
    color: 'bg-green-100',
  },
  {
    title: 'Engagement Rate',
    value: '4.2%',
    change: -2,
    icon: ChartBarIcon,
    color: 'bg-purple-100',
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
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
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
      <!-- Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          v-for="stat in stats"
          :key="stat.title"
          :title="stat.title"
          :value="stat.value"
          :change="stat.change"
          :icon="stat.icon"
          :color="stat.color"
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
        <div class="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 class="text-sm font-semibold text-gray-900">Recent Posts</h3>
            <NuxtLink to="/posts" class="text-xs text-brand-600 hover:text-brand-700 font-medium">
              View All
            </NuxtLink>
          </div>
          <div class="divide-y divide-gray-100">
            <div
              v-for="post in recentPosts"
              :key="post.id"
              class="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
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

        <!-- AI Suggestions -->
        <div class="bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl p-6 text-white">
          <div class="flex items-center gap-2 mb-4">
            <SparklesIcon class="w-5 h-5" />
            <h3 class="text-sm font-semibold">AI Suggestions</h3>
          </div>
          <div class="space-y-4">
            <div
              v-for="(suggestion, index) in aiSuggestions"
              :key="index"
              class="bg-white/10 rounded-lg p-3"
            >
              <div class="flex items-start gap-2">
                <ArrowTrendingUpIcon class="w-4 h-4 flex-shrink-0 mt-0.5 text-brand-200" />
                <p class="text-sm text-white/90 leading-relaxed">{{ suggestion }}</p>
              </div>
            </div>
          </div>
          <button
            class="mt-4 w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-sm font-medium transition-all duration-200"
            @click="router.push('/ai')"
          >
            Generate Content
          </button>
        </div>
      </div>
    </div>

    <PostModal v-model="showPostModal" @save="handleCreatePost" />
  </div>
</template>
