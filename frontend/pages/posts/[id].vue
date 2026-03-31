<script setup lang="ts">
import {
  ArrowLeftIcon,
  PhotoIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  PaperAirplaneIcon,
} from '@heroicons/vue/24/outline'
import { usePostsStore } from '~/stores/posts'
import type { Platform, PostStatus } from '~/types'

const route = useRoute()
const router = useRouter()
const postsStore = usePostsStore()
const { addToast } = useToast()

const saving = ref(false)

onMounted(() => {
  if (postsStore.posts.length === 0) {
    postsStore.loadPosts()
  }
})

const post = computed(() => {
  return postsStore.posts.find(p => p.id === route.params.id)
})

const content = ref('')
const selectedPlatforms = ref<Platform[]>([])
const scheduledDate = ref('')
const scheduledTime = ref('')

watch(post, (p) => {
  if (p) {
    content.value = p.content
    selectedPlatforms.value = [...p.platforms]
    if (p.scheduledAt) {
      const date = new Date(p.scheduledAt)
      scheduledDate.value = date.toISOString().split('T')[0]
      scheduledTime.value = date.toTimeString().slice(0, 5)
    }
  }
}, { immediate: true })

const charCount = computed(() => content.value.length)

const platforms: { id: Platform; label: string; color: string }[] = [
  { id: 'linkedin', label: 'LinkedIn', color: '#0077B5' },
  { id: 'facebook', label: 'Facebook', color: '#1877F2' },
  { id: 'twitter', label: 'Twitter/X', color: '#1DA1F2' },
  { id: 'instagram', label: 'Instagram', color: '#E4405F' },
]

const togglePlatform = (platform: Platform) => {
  const idx = selectedPlatforms.value.indexOf(platform)
  if (idx > -1) selectedPlatforms.value.splice(idx, 1)
  else selectedPlatforms.value.push(platform)
}

const save = async (status?: PostStatus) => {
  if (!post.value) return
  saving.value = true

  const scheduledAt = scheduledDate.value && scheduledTime.value
    ? new Date(`${scheduledDate.value}T${scheduledTime.value}`).toISOString()
    : undefined

  await new Promise(r => setTimeout(r, 500))

  postsStore.updatePost(post.value.id, {
    content: content.value,
    platforms: selectedPlatforms.value,
    scheduledAt,
    status: status || (scheduledAt ? 'scheduled' : post.value.status),
    updatedAt: new Date().toISOString(),
  })

  saving.value = false
  addToast('Post saved successfully', 'success')
}

const statusTimeline = computed(() => {
  if (!post.value) return []
  const steps = [
    {
      label: 'Created',
      date: post.value.createdAt,
      icon: PencilSquareIcon,
      done: true,
    },
    {
      label: 'Scheduled',
      date: post.value.scheduledAt,
      icon: CalendarIcon,
      done: post.value.status === 'scheduled' || post.value.status === 'published',
    },
    {
      label: 'Published',
      date: post.value.publishedAt,
      icon: CheckCircleIcon,
      done: post.value.status === 'published',
    },
  ]
  return steps
})
</script>

<template>
  <div>
    <AppTopbar title="Edit Post">
      <template #action>
        <div class="flex items-center gap-2">
          <button
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
            @click="router.back()"
          >
            Cancel
          </button>
          <button
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-all duration-200 disabled:opacity-50"
            :disabled="saving"
            @click="save()"
          >
            <LoadingSpinner v-if="saving" size="sm" />
            <template v-else>Save</template>
          </button>
        </div>
      </template>
    </AppTopbar>

    <div v-if="!post" class="flex items-center justify-center py-20">
      <LoadingSpinner size="lg" />
    </div>

    <div v-else class="p-6">
      <button
        class="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-all duration-200"
        @click="router.push('/posts')"
      >
        <ArrowLeftIcon class="w-4 h-4" />
        Back to Posts
      </button>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Editor -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Content Editor -->
          <div class="bg-white rounded-xl border border-gray-200 p-6">
            <label class="block text-sm font-semibold text-gray-900 mb-3">Content</label>
            <textarea
              v-model="content"
              rows="8"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none transition-all duration-200"
              placeholder="Write your post content..."
            />
            <div class="flex justify-between mt-2">
              <span class="text-xs text-gray-400">Supports up to 280 characters for Twitter</span>
              <span
                class="text-xs"
                :class="charCount > 280 ? 'text-red-500' : 'text-gray-400'"
              >
                {{ charCount }} characters
              </span>
            </div>
          </div>

          <!-- Platforms -->
          <div class="bg-white rounded-xl border border-gray-200 p-6">
            <label class="block text-sm font-semibold text-gray-900 mb-3">Platforms</label>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="p in platforms"
                :key="p.id"
                class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all duration-200"
                :class="
                  selectedPlatforms.includes(p.id)
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                "
                @click="togglePlatform(p.id)"
              >
                <PlatformIcon :platform="p.id" size="sm" />
                {{ p.label }}
              </button>
            </div>
          </div>

          <!-- Media -->
          <div class="bg-white rounded-xl border border-gray-200 p-6">
            <label class="block text-sm font-semibold text-gray-900 mb-3">Media</label>
            <div class="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-brand-400 transition-all duration-200 cursor-pointer">
              <PhotoIcon class="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p class="text-sm text-gray-500 font-medium">Drag & drop files or click to upload</p>
              <p class="text-xs text-gray-400 mt-1">PNG, JPG, GIF, MP4 up to 10MB</p>
            </div>
          </div>

          <!-- Schedule -->
          <div class="bg-white rounded-xl border border-gray-200 p-6">
            <label class="block text-sm font-semibold text-gray-900 mb-3">Schedule</label>
            <div class="flex gap-4">
              <div class="flex-1 relative">
                <CalendarIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  v-model="scheduledDate"
                  type="date"
                  class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div class="flex-1 relative">
                <ClockIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  v-model="scheduledTime"
                  type="time"
                  class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Preview -->
          <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Preview</h3>
            <div class="space-y-3">
              <div
                v-for="platform in selectedPlatforms"
                :key="platform"
                class="border border-gray-200 rounded-lg p-4"
              >
                <div class="flex items-center gap-2 mb-2">
                  <PlatformIcon :platform="platform" size="sm" />
                  <span class="text-xs font-medium text-gray-700 capitalize">{{ platform }}</span>
                </div>
                <p class="text-xs text-gray-600 leading-relaxed">
                  {{ content || 'Your content will appear here...' }}
                </p>
              </div>
              <div
                v-if="selectedPlatforms.length === 0"
                class="text-center py-6 text-gray-400"
              >
                <p class="text-sm">Select a platform to preview</p>
              </div>
            </div>
          </div>

          <!-- Status Timeline -->
          <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Status</h3>
            <div class="space-y-4">
              <div
                v-for="(step, index) in statusTimeline"
                :key="step.label"
                class="flex items-start gap-3"
              >
                <div class="flex flex-col items-center">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    :class="step.done ? 'bg-green-100' : 'bg-gray-100'"
                  >
                    <component
                      :is="step.icon"
                      class="w-4 h-4"
                      :class="step.done ? 'text-green-600' : 'text-gray-400'"
                    />
                  </div>
                  <div
                    v-if="index < statusTimeline.length - 1"
                    class="w-px h-6 mt-1"
                    :class="step.done ? 'bg-green-300' : 'bg-gray-200'"
                  />
                </div>
                <div class="pt-1">
                  <p class="text-sm font-medium" :class="step.done ? 'text-gray-900' : 'text-gray-400'">
                    {{ step.label }}
                  </p>
                  <p v-if="step.date" class="text-xs text-gray-400 mt-0.5">
                    {{ new Date(step.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <button
              class="w-full flex items-center justify-center gap-2 bg-brand-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-600 transition-all duration-200 disabled:opacity-50"
              :disabled="saving"
              @click="save('scheduled')"
            >
              <CalendarIcon class="w-4 h-4" />
              Schedule
            </button>
            <button
              class="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition-all duration-200 disabled:opacity-50"
              :disabled="saving"
              @click="save('published')"
            >
              <PaperAirplaneIcon class="w-4 h-4" />
              Publish Now
            </button>
            <button
              class="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all duration-200"
              @click="save('draft')"
            >
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
