<script setup lang="ts">
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon,
  SparklesIcon,
  PlusIcon,
  CalendarDaysIcon,
  ShareIcon,
  UserGroupIcon,
  ArrowRightIcon,
  RocketLaunchIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const { user } = useAuth()
const { current, workspaces, loadWorkspaces } = useWorkspace()

onMounted(() => {
  loadWorkspaces()
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Goedemorgen'
  if (hour < 17) return 'Goedemiddag'
  return 'Goedenavond'
})

const firstName = computed(() => {
  return user.value?.name?.split(' ')[0] || 'there'
})

const isEmpty = computed(() => {
  return !current.value
})

const quickActions = [
  {
    title: 'Create Post',
    description: 'Write and schedule a new social media post',
    icon: PlusIcon,
    color: 'bg-indigo-600',
    to: '/posts',
  },
  {
    title: 'AI Generate',
    description: 'Let AI create content for you',
    icon: SparklesIcon,
    color: 'bg-purple-600',
    to: '/ai',
  },
  {
    title: 'View Calendar',
    description: 'See your content calendar',
    icon: CalendarDaysIcon,
    color: 'bg-emerald-600',
    to: '/calendar',
  },
  {
    title: 'Connect Account',
    description: 'Link a social media account',
    icon: ShareIcon,
    color: 'bg-blue-600',
    to: '/social',
  },
]
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)]">
    <div class="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <!-- Welcome Header -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">
            {{ greeting }}, {{ firstName }}
          </h1>
          <p class="text-gray-500 mt-1">
            <template v-if="current">
              Workspace: <span class="font-medium text-gray-700">{{ current.name }}</span>
            </template>
            <template v-else>
              Get started by setting up your workspace
            </template>
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            class="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all duration-200"
            @click="router.push('/posts')"
          >
            <PlusIcon class="w-4 h-4" />
            New Post
          </button>
          <button
            class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-purple-700 hover:to-indigo-700 shadow-sm shadow-purple-600/20 transition-all duration-200"
            @click="router.push('/ai')"
          >
            <SparklesIcon class="w-4 h-4" />
            AI Generate
          </button>
        </div>
      </div>

      <!-- Empty State / Getting Started -->
      <template v-if="isEmpty">
        <div class="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-100 p-8 lg:p-12 text-center">
          <div class="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <RocketLaunchIcon class="w-8 h-8 text-indigo-600" />
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">Welcome to Contentrich!</h2>
          <p class="text-gray-600 max-w-lg mx-auto mb-8">
            Your AI-powered social media management platform. Start by connecting your social accounts and creating your first post.
          </p>
          <div class="flex items-center justify-center gap-4">
            <button
              class="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all duration-200"
              @click="router.push('/social')"
            >
              <ShareIcon class="w-4 h-4" />
              Connect Account
            </button>
            <button
              class="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all duration-200"
              @click="router.push('/posts')"
            >
              <PlusIcon class="w-4 h-4" />
              Create First Post
            </button>
          </div>
        </div>
      </template>

      <!-- Stats Row -->
      <template v-if="current">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <DocumentTextIcon class="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p class="text-2xl font-bold text-gray-900">0</p>
            <p class="text-sm text-gray-500 mt-0.5">Total Posts</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <ClockIcon class="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p class="text-2xl font-bold text-gray-900">0</p>
            <p class="text-sm text-gray-500 mt-0.5">Scheduled</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <CheckCircleIcon class="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p class="text-2xl font-bold text-gray-900">0</p>
            <p class="text-sm text-gray-500 mt-0.5">Published</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <UserGroupIcon class="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ workspaces.length }}</p>
            <p class="text-sm text-gray-500 mt-0.5">Workspaces</p>
          </div>
        </div>
      </template>

      <!-- Quick Actions Grid -->
      <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            v-for="action in quickActions"
            :key="action.title"
            class="group bg-white rounded-xl border border-gray-100 p-5 text-left hover:shadow-md hover:border-indigo-100 transition-all duration-200"
            @click="router.push(action.to)"
          >
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110"
              :class="action.color"
            >
              <component :is="action.icon" class="w-5 h-5 text-white" />
            </div>
            <h3 class="text-sm font-semibold text-gray-900 mb-1">{{ action.title }}</h3>
            <p class="text-xs text-gray-500 leading-relaxed">{{ action.description }}</p>
            <div class="flex items-center gap-1 mt-3 text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span>Get started</span>
              <ArrowRightIcon class="w-3 h-3" />
            </div>
          </button>
        </div>
      </div>

      <!-- AI Insights Card -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 text-white">
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div class="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <SparklesIcon class="w-5 h-5" />
              <span class="text-sm font-semibold text-white/90">AI Content Generator</span>
            </div>
            <h3 class="text-xl font-bold mb-2">Create engaging content with AI</h3>
            <p class="text-white/70 text-sm max-w-md">
              Generate captions, hashtags, and full posts tailored to your audience. Let AI handle the creative work while you focus on strategy.
            </p>
          </div>
          <button
            class="flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 rounded-xl text-sm font-bold hover:bg-white/90 transition-all duration-200 shadow-lg self-start"
            @click="router.push('/ai')"
          >
            <SparklesIcon class="w-4 h-4" />
            Try AI Generator
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
