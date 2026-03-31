<script setup lang="ts">
import {
  ArrowLeftIcon,
  PhotoIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  CommandLineIcon,
  ArrowUpTrayIcon,
} from '@heroicons/vue/24/outline'
import { usePostsStore } from '~/stores/posts'
import type { Platform, PostStatus } from '~/types'

const route = useRoute()
const router = useRouter()
const postsStore = usePostsStore()
const { addToast } = useToast()

const saving = ref(false)
const isDragging = ref(false)
const uploadProgress = ref(0)
const uploadedFiles = ref<{ name: string; preview: string; size: string }[]>([])

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

const platforms: { id: Platform; label: string; color: string; hex: string; maxChars: number }[] = [
  { id: 'linkedin', label: 'LinkedIn', color: '#0077B5', hex: '#0077B5', maxChars: 3000 },
  { id: 'facebook', label: 'Facebook', color: '#1877F2', hex: '#1877F2', maxChars: 63206 },
  { id: 'twitter', label: 'Twitter/X', color: '#1DA1F2', hex: '#1DA1F2', maxChars: 280 },
  { id: 'instagram', label: 'Instagram', color: '#E4405F', hex: '#E4405F', maxChars: 2200 },
]

const activeCharLimit = computed(() => {
  if (selectedPlatforms.value.length === 0) return 3000
  const limits = selectedPlatforms.value.map(p => {
    const config = platforms.find(pl => pl.id === p)
    return config?.maxChars || 3000
  })
  return Math.min(...limits)
})

const charRatio = computed(() => {
  return Math.min(charCount.value / activeCharLimit.value, 1)
})

const charRingColor = computed(() => {
  if (charRatio.value > 1) return '#ef4444'
  if (charRatio.value > 0.9) return '#f59e0b'
  if (charRatio.value > 0.75) return '#eab308'
  return '#6366f1'
})

const charRingDash = computed(() => {
  const circumference = 2 * Math.PI * 18
  const filled = charRatio.value * circumference
  return `${filled} ${circumference - filled}`
})

const togglePlatform = (platform: Platform) => {
  const idx = selectedPlatforms.value.indexOf(platform)
  if (idx > -1) selectedPlatforms.value.splice(idx, 1)
  else selectedPlatforms.value.push(platform)
}

const textareaRef = ref<HTMLTextAreaElement | null>(null)

const autoResize = () => {
  const el = textareaRef.value
  if (el) {
    el.style.height = 'auto'
    el.style.height = `${Math.max(el.scrollHeight, 160)}px`
  }
}

watch(content, () => {
  nextTick(autoResize)
})

onMounted(() => {
  nextTick(autoResize)
})

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

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault()
    save('published')
  }
  if ((e.metaKey || e.ctrlKey) && e.key === 's') {
    e.preventDefault()
    save()
  }
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  // Simulate file upload
  if (e.dataTransfer?.files) {
    Array.from(e.dataTransfer.files).forEach(file => {
      simulateUpload(file)
    })
  }
}

const simulateUpload = (file: File) => {
  uploadProgress.value = 0
  const interval = setInterval(() => {
    uploadProgress.value += 10
    if (uploadProgress.value >= 100) {
      clearInterval(interval)
      uploadedFiles.value.push({
        name: file.name,
        preview: URL.createObjectURL(file),
        size: `${(file.size / 1024).toFixed(1)} KB`,
      })
      uploadProgress.value = 0
    }
  }, 100)
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}

const statusTimeline = computed(() => {
  if (!post.value) return []
  return [
    {
      label: 'Created',
      date: post.value.createdAt,
      icon: PencilSquareIcon,
      done: true,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Scheduled',
      date: post.value.scheduledAt,
      icon: CalendarIcon,
      done: post.value.status === 'scheduled' || post.value.status === 'published',
      color: 'bg-amber-500',
      bgColor: 'bg-amber-100',
    },
    {
      label: 'Published',
      date: post.value.publishedAt,
      icon: CheckCircleIcon,
      done: post.value.status === 'published',
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-100',
    },
  ]
})

const getPlatformConfig = (platformId: Platform) => {
  return platforms.find(p => p.id === platformId)
}
</script>

<template>
  <div @keydown="handleKeydown">
    <AppTopbar title="Edit Post">
      <template #action>
        <div class="flex items-center gap-2">
          <!-- Keyboard shortcut hint -->
          <div class="hidden lg:flex items-center gap-1.5 text-xs text-gray-400 mr-2">
            <kbd class="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-mono">Cmd+S</kbd>
            <span>save</span>
            <kbd class="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-mono ml-2">Cmd+Enter</kbd>
            <span>publish</span>
          </div>
          <button
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
            @click="router.back()"
          >
            Cancel
          </button>
          <button
            class="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-brand-500 rounded-xl hover:bg-brand-600 transition-all duration-200 disabled:opacity-50 shadow-sm shadow-brand-500/25"
            :disabled="saving"
            @click="save()"
          >
            <LoadingSpinner v-if="saving" size="sm" />
            <template v-else>Save Changes</template>
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
          <!-- Content Editor with Character Count Ring -->
          <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <label class="block text-sm font-semibold text-gray-900">Content</label>
              <!-- Character Count Ring (Twitter-style) -->
              <div class="flex items-center gap-3">
                <span
                  class="text-xs font-medium transition-colors duration-200"
                  :class="{
                    'text-gray-400': charRatio < 0.75,
                    'text-amber-500': charRatio >= 0.75 && charRatio < 0.9,
                    'text-red-500': charRatio >= 0.9,
                  }"
                >
                  {{ charCount }} / {{ activeCharLimit }}
                </span>
                <div class="relative w-10 h-10">
                  <svg class="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
                    <circle
                      cx="20"
                      cy="20"
                      r="18"
                      fill="none"
                      stroke="#e5e7eb"
                      stroke-width="2.5"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="18"
                      fill="none"
                      :stroke="charRingColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      :stroke-dasharray="charRingDash"
                      class="transition-all duration-300"
                    />
                  </svg>
                  <span
                    v-if="charRatio > 0.9"
                    class="absolute inset-0 flex items-center justify-center text-[9px] font-bold"
                    :class="charCount > activeCharLimit ? 'text-red-500' : 'text-amber-500'"
                  >
                    {{ activeCharLimit - charCount }}
                  </span>
                </div>
              </div>
            </div>
            <textarea
              ref="textareaRef"
              v-model="content"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none transition-all duration-200 leading-relaxed"
              style="min-height: 160px"
              placeholder="Write your post content..."
              @input="autoResize"
            />
            <div class="flex items-center gap-2 mt-2 text-[10px] text-gray-400">
              <span v-for="p in selectedPlatforms" :key="p" class="flex items-center gap-1">
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :style="{ backgroundColor: getPlatformConfig(p)?.hex }"
                />
                {{ getPlatformConfig(p)?.label }}: {{ getPlatformConfig(p)?.maxChars }} chars
              </span>
            </div>
          </div>

          <!-- Platforms -->
          <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <label class="block text-sm font-semibold text-gray-900 mb-3">Platforms</label>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="p in platforms"
                :key="p.id"
                class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all duration-200"
                :class="
                  selectedPlatforms.includes(p.id)
                    ? 'shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                "
                :style="selectedPlatforms.includes(p.id) ? {
                  borderColor: p.hex,
                  backgroundColor: `${p.hex}10`,
                  color: p.hex,
                } : {}"
                @click="togglePlatform(p.id)"
              >
                <PlatformIcon :platform="p.id" size="sm" />
                {{ p.label }}
                <svg
                  v-if="selectedPlatforms.includes(p.id)"
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Media Upload with Drag & Drop -->
          <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <label class="block text-sm font-semibold text-gray-900 mb-3">Media</label>

            <!-- Uploaded file previews -->
            <div v-if="uploadedFiles.length > 0" class="flex flex-wrap gap-3 mb-4">
              <div
                v-for="(file, idx) in uploadedFiles"
                :key="idx"
                class="relative group/thumb w-24 h-24 rounded-xl overflow-hidden border border-gray-200"
              >
                <img :src="file.preview" :alt="file.name" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <button
                    class="p-1 bg-white/90 rounded-full text-red-500 hover:bg-white transition-all duration-150"
                    @click="removeFile(idx)"
                  >
                    <XMarkIcon class="w-4 h-4" />
                  </button>
                </div>
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                  <p class="text-[8px] text-white truncate">{{ file.name }}</p>
                </div>
              </div>
            </div>

            <!-- Upload progress bar -->
            <div v-if="uploadProgress > 0" class="mb-4">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs text-gray-500">Uploading...</span>
                <span class="text-xs font-medium text-brand-600">{{ uploadProgress }}%</span>
              </div>
              <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-brand-500 rounded-full transition-all duration-200"
                  :style="{ width: `${uploadProgress}%` }"
                />
              </div>
            </div>

            <!-- Drop zone -->
            <div
              class="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200"
              :class="isDragging
                ? 'border-brand-400 bg-brand-50/50 scale-[1.01]'
                : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50'
              "
              @dragover="handleDragOver"
              @dragleave="handleDragLeave"
              @drop="handleDrop"
            >
              <div class="flex flex-col items-center">
                <div
                  class="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all duration-200"
                  :class="isDragging ? 'bg-brand-100' : 'bg-gray-100'"
                >
                  <ArrowUpTrayIcon
                    class="w-6 h-6 transition-colors duration-200"
                    :class="isDragging ? 'text-brand-500' : 'text-gray-400'"
                  />
                </div>
                <p class="text-sm font-medium" :class="isDragging ? 'text-brand-600' : 'text-gray-500'">
                  {{ isDragging ? 'Drop files here' : 'Drag & drop files or click to upload' }}
                </p>
                <p class="text-xs text-gray-400 mt-1">PNG, JPG, GIF, MP4 up to 10MB</p>
              </div>
            </div>
          </div>

          <!-- Schedule -->
          <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <label class="block text-sm font-semibold text-gray-900 mb-3">Schedule</label>
            <div class="flex gap-4">
              <div class="flex-1 relative">
                <CalendarIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  v-model="scheduledDate"
                  type="date"
                  class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div class="flex-1 relative">
                <ClockIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  v-model="scheduledTime"
                  type="time"
                  class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <p v-if="scheduledDate && scheduledTime" class="mt-2 text-xs text-brand-600 font-medium">
              Scheduled for {{ new Date(`${scheduledDate}T${scheduledTime}`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }) }}
            </p>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Platform Previews (Realistic Mockups) -->
          <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Preview</h3>
            <div class="space-y-4">
              <div
                v-for="platformId in selectedPlatforms"
                :key="platformId"
                class="rounded-xl overflow-hidden border border-gray-200"
              >
                <!-- Platform header bar -->
                <div
                  class="px-3 py-2 flex items-center gap-2"
                  :style="{ backgroundColor: `${getPlatformConfig(platformId)?.hex}10` }"
                >
                  <PlatformIcon :platform="platformId" size="xs" />
                  <span
                    class="text-xs font-semibold capitalize"
                    :style="{ color: getPlatformConfig(platformId)?.hex }"
                  >
                    {{ platformId }}
                  </span>
                  <span class="text-[9px] text-gray-400 ml-auto">
                    {{ getPlatformConfig(platformId)?.maxChars }} char limit
                  </span>
                </div>
                <!-- Mockup content -->
                <div class="p-3 bg-white">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span class="text-[10px] font-bold text-gray-500">You</span>
                    </div>
                    <div>
                      <p class="text-xs font-semibold text-gray-800">Your Brand</p>
                      <p class="text-[9px] text-gray-400">Just now</p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {{ content || 'Your content will appear here...' }}
                  </p>
                  <!-- Uploaded images preview -->
                  <div v-if="uploadedFiles.length > 0" class="mt-2 rounded-lg overflow-hidden border border-gray-100">
                    <img :src="uploadedFiles[0].preview" class="w-full h-32 object-cover" alt="" />
                  </div>
                  <!-- Platform-specific footer -->
                  <div class="flex items-center gap-4 mt-3 pt-2 border-t border-gray-100">
                    <span class="text-[10px] text-gray-400">Like</span>
                    <span class="text-[10px] text-gray-400">Comment</span>
                    <span class="text-[10px] text-gray-400">Share</span>
                  </div>
                </div>
                <!-- Character warning -->
                <div
                  v-if="content.length > (getPlatformConfig(platformId)?.maxChars || 3000)"
                  class="px-3 py-1.5 bg-red-50 border-t border-red-100"
                >
                  <p class="text-[10px] text-red-600 font-medium">
                    Exceeds {{ getPlatformConfig(platformId)?.label }} limit by {{ content.length - (getPlatformConfig(platformId)?.maxChars || 3000) }} characters
                  </p>
                </div>
              </div>
              <div
                v-if="selectedPlatforms.length === 0"
                class="text-center py-8 text-gray-400"
              >
                <div class="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <PhotoIcon class="w-6 h-6 text-gray-300" />
                </div>
                <p class="text-sm">Select a platform to preview</p>
              </div>
            </div>
          </div>

          <!-- Status Timeline (Horizontal Stepper) -->
          <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 class="text-sm font-semibold text-gray-900 mb-5">Status Timeline</h3>
            <!-- Horizontal stepper -->
            <div class="flex items-center justify-between mb-6">
              <template v-for="(step, index) in statusTimeline" :key="step.label">
                <div class="flex flex-col items-center flex-shrink-0">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300"
                    :class="step.done ? step.bgColor : 'bg-gray-100'"
                  >
                    <component
                      :is="step.icon"
                      class="w-5 h-5 transition-colors duration-300"
                      :class="step.done ? 'text-white' : 'text-gray-300'"
                      :style="step.done ? { color: 'white' } : {}"
                    />
                    <div
                      v-if="step.done"
                      class="absolute w-10 h-10 rounded-full animate-ping opacity-10"
                      :class="step.color"
                    />
                  </div>
                  <p
                    class="text-[10px] font-semibold text-center"
                    :class="step.done ? 'text-gray-800' : 'text-gray-400'"
                  >
                    {{ step.label }}
                  </p>
                  <p v-if="step.date" class="text-[8px] text-gray-400 mt-0.5 text-center">
                    {{ new Date(step.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
                  </p>
                </div>
                <!-- Connector line -->
                <div
                  v-if="index < statusTimeline.length - 1"
                  class="flex-1 h-0.5 mx-2 mb-6 rounded-full transition-all duration-300"
                  :class="step.done ? 'bg-emerald-300' : 'bg-gray-200'"
                />
              </template>
            </div>
          </div>

          <!-- Actions -->
          <div class="bg-white rounded-xl border border-gray-200 p-6 space-y-3 shadow-sm">
            <button
              class="w-full flex items-center justify-center gap-2 bg-brand-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-600 transition-all duration-200 disabled:opacity-50 shadow-sm shadow-brand-500/25"
              :disabled="saving"
              @click="save('scheduled')"
            >
              <CalendarIcon class="w-4 h-4" />
              Schedule
            </button>
            <button
              class="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-all duration-200 disabled:opacity-50 shadow-sm shadow-emerald-500/25"
              :disabled="saving"
              @click="save('published')"
            >
              <PaperAirplaneIcon class="w-4 h-4" />
              Publish Now
            </button>
            <button
              class="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              @click="save('draft')"
            >
              Save as Draft
            </button>
            <div class="pt-2 border-t border-gray-100">
              <p class="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
                <kbd class="px-1 py-0.5 bg-gray-100 border border-gray-200 rounded text-[9px] font-mono">Cmd+Enter</kbd>
                to publish
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
