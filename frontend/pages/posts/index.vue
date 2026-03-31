<script setup lang="ts">
import {
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  TrashIcon,
  PlusIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ArchiveBoxIcon,
  ArrowPathIcon,
  CalendarIcon,
} from '@heroicons/vue/24/outline'
import { usePostsStore } from '~/stores/posts'
import type { PostStatus, Platform, Post } from '~/types'

const postsStore = usePostsStore()
const router = useRouter()
const { addToast } = useToast()

const showPostModal = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')
const selectedPosts = ref<string[]>([])
const searchQuery = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const statusFilters: { id: PostStatus | 'all'; label: string; color: string; dotClass: string }[] = [
  { id: 'all', label: 'All', color: '', dotClass: 'bg-gray-400' },
  { id: 'draft', label: 'Drafts', color: 'text-gray-500', dotClass: 'bg-gray-400' },
  { id: 'scheduled', label: 'Scheduled', color: 'text-amber-600', dotClass: 'bg-amber-500' },
  { id: 'published', label: 'Published', color: 'text-emerald-600', dotClass: 'bg-emerald-500' },
  { id: 'failed', label: 'Failed', color: 'text-red-600', dotClass: 'bg-red-500' },
]

const platformFilters: { id: Platform | 'all'; label: string; color: string }[] = [
  { id: 'all', label: 'All Platforms', color: '' },
  { id: 'linkedin', label: 'LinkedIn', color: 'bg-[#0077B5]' },
  { id: 'facebook', label: 'Facebook', color: 'bg-[#1877F2]' },
  { id: 'twitter', label: 'Twitter/X', color: 'bg-[#1DA1F2]' },
  { id: 'instagram', label: 'Instagram', color: 'bg-[#E4405F]' },
]

onMounted(() => {
  postsStore.loadPosts()
})

const handleSearch = (value: string) => {
  searchQuery.value = value
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    postsStore.setFilter('search', value)
  }, 300)
}

const clearSearch = () => {
  searchQuery.value = ''
  postsStore.setFilter('search', '')
  searchInputRef.value?.focus()
}

const handleEditPost = (id: string) => {
  router.push(`/posts/${id}`)
}

const handleDeletePost = (id: string) => {
  postsStore.deletePost(id)
  selectedPosts.value = selectedPosts.value.filter(pid => pid !== id)
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

const toggleSelectAll = () => {
  if (selectedPosts.value.length === postsStore.filteredPosts.length) {
    selectedPosts.value = []
  } else {
    selectedPosts.value = postsStore.filteredPosts.map(p => p.id)
  }
}

const isAllSelected = computed(() => {
  return postsStore.filteredPosts.length > 0 && selectedPosts.value.length === postsStore.filteredPosts.length
})

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

const activeFilterIndex = computed(() => {
  return statusFilters.findIndex(f => f.id === postsStore.filters.status)
})

const platformColor = (platform: Platform): string => {
  const colors: Record<Platform, string> = {
    linkedin: '#0077B5',
    facebook: '#1877F2',
    twitter: '#1DA1F2',
    instagram: '#E4405F',
  }
  return colors[platform]
}
</script>

<template>
  <div>
    <AppTopbar title="Posts" subtitle="Manage all your social media content." @action="showPostModal = true" />

    <div class="p-6">
      <!-- Filters Bar -->
      <div class="flex items-center justify-between mb-6 gap-4">
        <div class="flex items-center gap-4 flex-1">
          <!-- Status Filter with animated underline -->
          <div class="relative flex items-center gap-0.5 bg-white border border-gray-200 rounded-xl p-1">
            <button
              v-for="(filter, index) in statusFilters"
              :key="filter.id"
              class="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 z-10"
              :class="
                postsStore.filters.status === filter.id
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-800'
              "
              @click="postsStore.setFilter('status', filter.id)"
            >
              <span
                v-if="filter.id !== 'all'"
                class="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-200"
                :class="postsStore.filters.status === filter.id ? 'bg-white/80' : filter.dotClass"
              />
              {{ filter.label }}
            </button>
            <!-- Animated background pill -->
            <div
              class="absolute top-1 bottom-1 bg-brand-500 rounded-lg transition-all duration-300 ease-out z-0 shadow-sm"
              :style="{
                left: `${4 + activeFilterIndex * (100 / statusFilters.length)}%`,
                width: `${100 / statusFilters.length - 1}%`,
              }"
            />
          </div>

          <!-- Platform Filter -->
          <div class="relative">
            <select
              :value="postsStore.filters.platform"
              class="appearance-none pl-4 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent cursor-pointer transition-all duration-200 hover:border-gray-300"
              @change="postsStore.setFilter('platform', ($event.target as HTMLSelectElement).value)"
            >
              <option v-for="filter in platformFilters" :key="filter.id" :value="filter.id">
                {{ filter.label }}
              </option>
            </select>
            <FunnelIcon class="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <!-- Search with debounce and clear -->
          <div class="relative flex-1 max-w-xs">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref="searchInputRef"
              :value="searchQuery"
              type="text"
              placeholder="Search posts..."
              class="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
              @input="handleSearch(($event.target as HTMLInputElement).value)"
            />
            <Transition
              enter-active-class="transition ease-out duration-150"
              enter-from-class="opacity-0 scale-75"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-75"
            >
              <button
                v-if="searchQuery"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all duration-150"
                @click="clearSearch"
              >
                <XMarkIcon class="w-4 h-4" />
              </button>
            </Transition>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- View Toggle -->
          <div class="flex items-center bg-white border border-gray-200 rounded-xl p-1">
            <button
              class="p-2 rounded-lg transition-all duration-200"
              :class="viewMode === 'grid' ? 'bg-brand-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'"
              @click="viewMode = 'grid'"
            >
              <Squares2X2Icon class="w-4 h-4" />
            </button>
            <button
              class="p-2 rounded-lg transition-all duration-200"
              :class="viewMode === 'list' ? 'bg-brand-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'"
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
      <div
        v-else-if="postsStore.filteredPosts.length === 0"
        class="flex flex-col items-center justify-center py-20 px-4"
      >
        <div class="relative mb-6">
          <div class="w-24 h-24 bg-gradient-to-br from-brand-50 to-brand-100 rounded-3xl flex items-center justify-center">
            <DocumentTextIcon class="w-10 h-10 text-brand-400" />
          </div>
          <div class="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center">
            <PlusIcon class="w-4 h-4 text-amber-600" />
          </div>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-1">No posts found</h3>
        <p class="text-sm text-gray-500 mb-6 text-center max-w-sm">
          {{ postsStore.filters.search ? 'Try adjusting your search or filters.' : 'Create your first post to get started with content management.' }}
        </p>
        <button
          class="flex items-center gap-2 bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-600 transition-all duration-200 shadow-sm shadow-brand-500/25"
          @click="showPostModal = true"
        >
          <PlusIcon class="w-4 h-4" />
          Create Post
        </button>
      </div>

      <!-- Grid View -->
      <TransitionGroup
        v-else-if="viewMode === 'grid'"
        tag="div"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div
          v-for="post in postsStore.filteredPosts"
          :key="post.id"
          class="relative"
        >
          <!-- Selection checkbox overlay -->
          <div
            class="absolute top-3 left-3 z-10"
            :class="selectedPosts.length > 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
          >
            <input
              type="checkbox"
              :checked="selectedPosts.includes(post.id)"
              class="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500 cursor-pointer"
              @change="toggleSelectPost(post.id)"
              @click.stop
            />
          </div>
          <PostCard
            :post="post"
            @edit="handleEditPost"
            @delete="handleDeletePost"
          />
        </div>
      </TransitionGroup>

      <!-- List View -->
      <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-50/80">
              <th class="px-4 py-3 text-left w-8">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  class="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500 cursor-pointer"
                  @change="toggleSelectAll"
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
              class="group cursor-pointer transition-all duration-200"
              :class="selectedPosts.includes(post.id) ? 'bg-brand-50/50' : 'hover:bg-gray-50'"
              @click="handleEditPost(post.id)"
            >
              <td class="px-4 py-3.5" @click.stop>
                <input
                  type="checkbox"
                  :checked="selectedPosts.includes(post.id)"
                  class="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500 cursor-pointer"
                  @change="toggleSelectPost(post.id)"
                />
              </td>
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-3 max-w-md">
                  <!-- Image thumbnail placeholder -->
                  <div
                    v-if="post.mediaUrls && post.mediaUrls.length > 0"
                    class="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden"
                  >
                    <img :src="post.mediaUrls[0]" class="w-full h-full object-cover" alt="" />
                  </div>
                  <p class="text-sm text-gray-700 truncate group-hover:text-gray-900 transition-colors duration-150">
                    {{ post.content }}
                  </p>
                </div>
              </td>
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-1">
                  <PlatformIcon v-for="platform in post.platforms" :key="platform" :platform="platform" size="xs" />
                </div>
              </td>
              <td class="px-4 py-3.5">
                <StatusBadge :status="post.status" />
              </td>
              <td class="px-4 py-3.5">
                <span class="text-sm text-gray-500">
                  {{ new Date(post.scheduledAt || post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
                </span>
              </td>
              <td class="px-4 py-3.5">
                <div v-if="post.status === 'published'" class="flex items-center gap-3 text-sm text-gray-500">
                  <span class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    {{ post.engagement.likes }}
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    {{ post.engagement.comments }}
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    {{ post.engagement.shares }}
                  </span>
                </div>
                <span v-else class="text-sm text-gray-300">--</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Floating Bulk Action Bar -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-8"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-8"
    >
      <div
        v-if="selectedPosts.length > 0"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-3 bg-gray-900 text-white rounded-2xl shadow-2xl shadow-black/20"
      >
        <span class="text-sm font-medium">
          {{ selectedPosts.length }} selected
        </span>
        <div class="w-px h-5 bg-gray-600" />
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
          @click="selectedPosts = []"
        >
          <XMarkIcon class="w-4 h-4" />
          Deselect
        </button>
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
          @click="handleBulkDelete"
        >
          <TrashIcon class="w-4 h-4" />
          Delete
        </button>
      </div>
    </Transition>

    <PostModal v-model="showPostModal" @save="handleCreatePost" />
  </div>
</template>
