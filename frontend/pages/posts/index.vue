<script setup lang="ts">
import {
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  TrashIcon,
  PlusIcon,
  DocumentTextIcon,
} from '@heroicons/vue/24/outline'
import { usePostsStore } from '~/stores/posts'
import type { PostStatus, Platform, Post } from '~/types'

const postsStore = usePostsStore()
const router = useRouter()
const { addToast } = useToast()

const showPostModal = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')
const selectedPosts = ref<string[]>([])

const statusFilters: { id: PostStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Drafts' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'published', label: 'Published' },
  { id: 'failed', label: 'Failed' },
]

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

const handleEditPost = (id: string) => {
  router.push(`/posts/${id}`)
}

const handleDeletePost = (id: string) => {
  postsStore.deletePost(id)
  addToast('Post deleted successfully', 'success')
}

const handleBulkDelete = () => {
  selectedPosts.value.forEach(id => postsStore.deletePost(id))
  addToast(`${selectedPosts.value.length} posts deleted`, 'success')
  selectedPosts.value = []
}

const toggleSelectPost = (id: string) => {
  const index = selectedPosts.value.indexOf(id)
  if (index > -1) {
    selectedPosts.value.splice(index, 1)
  } else {
    selectedPosts.value.push(id)
  }
}

const handleCreatePost = (data: any) => {
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
</script>

<template>
  <div>
    <AppTopbar title="Posts" subtitle="Manage all your social media content." @action="showPostModal = true" />

    <div class="p-6">
      <!-- Filters Bar -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <!-- Status Filter -->
          <div class="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
            <button
              v-for="filter in statusFilters"
              :key="filter.id"
              class="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
              :class="
                postsStore.filters.status === filter.id
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              "
              @click="postsStore.setFilter('status', filter.id)"
            >
              {{ filter.label }}
            </button>
          </div>

          <!-- Platform Filter -->
          <select
            :value="postsStore.filters.platform"
            class="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
            @change="postsStore.setFilter('platform', ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="filter in platformFilters" :key="filter.id" :value="filter.id">
              {{ filter.label }}
            </option>
          </select>

          <!-- Search -->
          <input
            :value="postsStore.filters.search"
            type="text"
            placeholder="Search posts..."
            class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 w-64"
            @input="postsStore.setFilter('search', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <div class="flex items-center gap-2">
          <!-- Bulk Actions -->
          <button
            v-if="selectedPosts.length > 0"
            class="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-all duration-200"
            @click="handleBulkDelete"
          >
            <TrashIcon class="w-4 h-4" />
            Delete ({{ selectedPosts.length }})
          </button>

          <!-- View Toggle -->
          <div class="flex items-center bg-white border border-gray-200 rounded-lg p-1">
            <button
              class="p-1.5 rounded-md transition-all duration-200"
              :class="viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'"
              @click="viewMode = 'grid'"
            >
              <Squares2X2Icon class="w-4 h-4" />
            </button>
            <button
              class="p-1.5 rounded-md transition-all duration-200"
              :class="viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'"
              @click="viewMode = 'list'"
            >
              <ListBulletIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="postsStore.loading" class="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>

      <!-- Empty State -->
      <EmptyState
        v-else-if="postsStore.filteredPosts.length === 0"
        :icon="DocumentTextIcon"
        title="No posts found"
        description="Create your first post or adjust your filters."
        action-label="Create Post"
        @action="showPostModal = true"
      />

      <!-- Grid View -->
      <div
        v-else-if="viewMode === 'grid'"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <PostCard
          v-for="post in postsStore.filteredPosts"
          :key="post.id"
          :post="post"
          @edit="handleEditPost"
          @delete="handleDeletePost"
        />
      </div>

      <!-- List View -->
      <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-50">
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-8">
                <input
                  type="checkbox"
                  class="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                />
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Content</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Platforms</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Engagement</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="post in postsStore.filteredPosts"
              :key="post.id"
              class="hover:bg-gray-50 cursor-pointer transition-all duration-200"
              @click="handleEditPost(post.id)"
            >
              <td class="px-4 py-3" @click.stop>
                <input
                  type="checkbox"
                  :checked="selectedPosts.includes(post.id)"
                  class="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                  @change="toggleSelectPost(post.id)"
                />
              </td>
              <td class="px-4 py-3">
                <p class="text-sm text-gray-700 truncate max-w-xs">{{ post.content }}</p>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-1">
                  <PlatformIcon v-for="platform in post.platforms" :key="platform" :platform="platform" size="xs" />
                </div>
              </td>
              <td class="px-4 py-3">
                <StatusBadge :status="post.status" />
              </td>
              <td class="px-4 py-3">
                <span class="text-sm text-gray-500">
                  {{ new Date(post.scheduledAt || post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span v-if="post.status === 'published'" class="text-sm text-gray-500">
                  {{ post.engagement.likes + post.engagement.comments + post.engagement.shares }}
                </span>
                <span v-else class="text-sm text-gray-300">--</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <PostModal v-model="showPostModal" @save="handleCreatePost" />
  </div>
</template>
