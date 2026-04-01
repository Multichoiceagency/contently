<script setup lang="ts">
import {
  CalendarIcon,
  FunnelIcon,
  ClockIcon,
  SparklesIcon,
} from '@heroicons/vue/24/outline'
import { usePostsStore } from '~/stores/posts'
import type { Post, Platform } from '~/types'

const postsStore = usePostsStore()
const router = useRouter()
const { addToast } = useToast()
const { token } = useAuth()
const { current } = useWorkspace()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

const showPostModal = ref(false)
const selectedDate = ref<Date | null>(null)
const editingPost = ref<Post | null>(null)
const selectedPlatform = ref<Platform | 'all'>('all')

const platformFilters: { id: Platform | 'all'; label: string; color: string }[] = [
  { id: 'all', label: 'All Platforms', color: 'bg-gray-500' },
  { id: 'linkedin', label: 'LinkedIn', color: 'bg-[#0077B5]' },
  { id: 'facebook', label: 'Facebook', color: 'bg-[#1877F2]' },
  { id: 'twitter', label: 'Twitter/X', color: 'bg-[#1DA1F2]' },
  { id: 'instagram', label: 'Instagram', color: 'bg-[#E4405F]' },
]

onMounted(() => {
  if (token.value && current.value?.id) {
    postsStore.fetchPosts(apiBase, token.value, current.value.id)
  }
})

const filteredPosts = computed(() => {
  if (selectedPlatform.value === 'all') return postsStore.posts
  return postsStore.posts.filter(p => p.platforms.includes(selectedPlatform.value as Platform))
})

const upcomingPosts = computed(() => {
  const now = new Date()
  return postsStore.posts
    .filter(p => p.status === 'scheduled' && p.scheduledAt && new Date(p.scheduledAt) > now)
    .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime())
    .slice(0, 10)
})

const handleSelectDate = (date: Date) => {
  selectedDate.value = date
  editingPost.value = null
  showPostModal.value = true
}

const handleSelectPost = (post: Post) => {
  editingPost.value = post
  showPostModal.value = true
}

const handleSavePost = async (data: any) => {
  if (!token.value || !current.value?.id) return
  try {
    const platform = data.platforms?.[0] || 'linkedin'
    if (editingPost.value) {
      await postsStore.updatePostApi(apiBase, token.value, current.value.id, editingPost.value.id, {
        content: data.content,
        platform,
        status: data.status,
        scheduledAt: data.scheduledAt,
      })
      addToast('Post updated successfully', 'success')
    } else {
      await postsStore.createPost(apiBase, token.value, current.value.id, {
        content: data.content,
        platform,
        status: data.status || 'draft',
        scheduledAt: data.scheduledAt,
      })
      addToast('Post created successfully', 'success')
    }
    await postsStore.fetchPosts(apiBase, token.value, current.value.id)
  } catch {
    addToast('Failed to save post', 'error')
  }
}

const getRelativeTime = (dateStr: string): string => {
  const now = new Date()
  const target = new Date(dateStr)
  const diffMs = target.getTime() - now.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 0) return 'Past due'
  if (diffMins < 60) return `in ${diffMins}m`
  if (diffHours < 24) return `in ${diffHours}h`
  if (diffDays === 1) {
    return `tomorrow at ${target.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
  }
  if (diffDays < 7) {
    return `${target.toLocaleDateString('en-US', { weekday: 'short' })} at ${target.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
  }
  return target.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

const getRelativeTimeColor = (dateStr: string): string => {
  const now = new Date()
  const target = new Date(dateStr)
  const diffHours = (target.getTime() - now.getTime()) / (1000 * 60 * 60)
  if (diffHours < 1) return 'text-red-500'
  if (diffHours < 6) return 'text-amber-500'
  return 'text-gray-400'
}

const platformBorderColor = (platforms: Platform[]): string => {
  if (!platforms.length) return 'border-l-gray-300'
  const colors: Record<Platform, string> = {
    linkedin: 'border-l-[#0077B5]',
    facebook: 'border-l-[#1877F2]',
    twitter: 'border-l-[#1DA1F2]',
    instagram: 'border-l-[#E4405F]',
  }
  return colors[platforms[0]]
}
</script>

<template>
  <div>
    <AppTopbar title="Calendar" subtitle="Plan and schedule your content." @action="showPostModal = true" />

    <div class="p-6">
      <!-- Platform Filters -->
      <div class="flex items-center gap-2 mb-6">
        <FunnelIcon class="w-4 h-4 text-gray-400" />
        <button
          v-for="filter in platformFilters"
          :key="filter.id"
          class="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border"
          :class="
            selectedPlatform === filter.id
              ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:shadow-sm'
          "
          @click="selectedPlatform = filter.id"
        >
          <span
            class="w-2 h-2 rounded-full flex-shrink-0"
            :class="selectedPlatform === filter.id ? 'bg-white/80' : filter.color"
          />
          {{ filter.label }}
        </button>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <!-- Calendar -->
        <div class="xl:col-span-3">
          <CalendarGrid
            :posts="filteredPosts"
            @select-date="handleSelectDate"
            @select-post="handleSelectPost"
          />
        </div>

        <!-- Upcoming Scheduled -->
        <div class="bg-white rounded-xl border border-gray-200 h-fit shadow-sm">
          <div class="flex items-center gap-2 px-5 py-4 border-b border-gray-200">
            <ClockIcon class="w-5 h-5 text-gray-400" />
            <h3 class="text-sm font-semibold text-gray-900">Upcoming</h3>
            <span
              v-if="upcomingPosts.length > 0"
              class="ml-auto text-[10px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full"
            >
              {{ upcomingPosts.length }}
            </span>
          </div>
          <div v-if="upcomingPosts.length > 0" class="divide-y divide-gray-100">
            <div
              v-for="post in upcomingPosts"
              :key="post.id"
              class="px-5 py-3.5 hover:bg-gray-50 cursor-pointer transition-all duration-200 border-l-2 border-l-transparent hover:border-l-brand-500 group"
              :class="platformBorderColor(post.platforms)"
              @click="handleSelectPost(post)"
            >
              <div class="flex items-center gap-1.5 mb-1.5">
                <PlatformIcon
                  v-for="platform in post.platforms"
                  :key="platform"
                  :platform="platform"
                  size="xs"
                />
                <StatusBadge :status="post.status" class="!text-[9px] !px-1.5 !py-0" />
              </div>
              <p class="text-xs text-gray-700 line-clamp-2 mb-1.5 group-hover:text-gray-900 transition-colors duration-150">
                {{ post.content }}
              </p>
              <div class="flex items-center gap-1">
                <ClockIcon class="w-3 h-3" :class="getRelativeTimeColor(post.scheduledAt!)" />
                <p
                  class="text-[10px] font-medium"
                  :class="getRelativeTimeColor(post.scheduledAt!)"
                >
                  {{ getRelativeTime(post.scheduledAt!) }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="px-5 py-10 text-center">
            <div class="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <CalendarIcon class="w-6 h-6 text-gray-300" />
            </div>
            <p class="text-sm font-medium text-gray-400 mb-1">No upcoming posts</p>
            <p class="text-xs text-gray-300">Schedule content to see it here</p>
          </div>
        </div>
      </div>
    </div>

    <PostModal
      v-model="showPostModal"
      :edit-post="editingPost ? {
        id: editingPost.id,
        content: editingPost.content,
        platforms: editingPost.platforms,
        scheduledAt: editingPost.scheduledAt,
        status: editingPost.status,
      } : null"
      @save="handleSavePost"
    />
  </div>
</template>
