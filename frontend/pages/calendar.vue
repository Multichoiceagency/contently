<script setup lang="ts">
import {
  CalendarIcon,
  FunnelIcon,
  ClockIcon,
} from '@heroicons/vue/24/outline'
import { usePostsStore } from '~/stores/posts'
import type { Post, Platform } from '~/types'

const postsStore = usePostsStore()
const router = useRouter()
const { addToast } = useToast()

const showPostModal = ref(false)
const selectedDate = ref<Date | null>(null)
const editingPost = ref<Post | null>(null)
const selectedPlatform = ref<Platform | 'all'>('all')

const platformFilters: { id: Platform | 'all'; label: string }[] = [
  { id: 'all', label: 'All Platforms' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'twitter', label: 'Twitter/X' },
  { id: 'instagram', label: 'Instagram' },
]

onMounted(() => {
  postsStore.loadPosts()
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

const handleSavePost = (data: any) => {
  if (editingPost.value) {
    postsStore.updatePost(editingPost.value.id, data)
    addToast('Post updated successfully', 'success')
  } else {
    const newPost: Post = {
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
    addToast('Post created successfully', 'success')
  }
}

const formatScheduledTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
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
          class="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
          :class="
            selectedPlatform === filter.id
              ? 'bg-brand-500 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
          "
          @click="selectedPlatform = filter.id"
        >
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
        <div class="bg-white rounded-xl border border-gray-200 h-fit">
          <div class="flex items-center gap-2 px-5 py-4 border-b border-gray-200">
            <ClockIcon class="w-5 h-5 text-gray-400" />
            <h3 class="text-sm font-semibold text-gray-900">Upcoming</h3>
          </div>
          <div v-if="upcomingPosts.length > 0" class="divide-y divide-gray-100">
            <div
              v-for="post in upcomingPosts"
              :key="post.id"
              class="px-5 py-3 hover:bg-gray-50 cursor-pointer transition-all duration-200"
              @click="handleSelectPost(post)"
            >
              <div class="flex items-center gap-1.5 mb-1.5">
                <PlatformIcon
                  v-for="platform in post.platforms"
                  :key="platform"
                  :platform="platform"
                  size="xs"
                />
              </div>
              <p class="text-xs text-gray-700 line-clamp-2 mb-1">{{ post.content }}</p>
              <p class="text-[10px] text-gray-400">{{ formatScheduledTime(post.scheduledAt!) }}</p>
            </div>
          </div>
          <div v-else class="px-5 py-8 text-center">
            <CalendarIcon class="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p class="text-sm text-gray-400">No upcoming posts</p>
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
