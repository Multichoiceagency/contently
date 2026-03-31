<script setup lang="ts">
import {
  XMarkIcon,
  PhotoIcon,
  CalendarIcon,
  ClockIcon,
  ArrowUpTrayIcon,
} from '@heroicons/vue/24/outline'
import type { Platform, PostStatus } from '~/types'

const props = defineProps<{
  modelValue: boolean
  editPost?: {
    id: string
    content: string
    platforms: Platform[]
    scheduledAt?: string
    status: PostStatus
  } | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', data: {
    content: string
    platforms: Platform[]
    scheduledAt?: string
    status: PostStatus
  }): void
}>()

const content = ref('')
const selectedPlatforms = ref<Platform[]>([])
const scheduledDate = ref('')
const scheduledTime = ref('')
const status = ref<PostStatus>('draft')

const charCount = computed(() => content.value.length)

const platforms: { id: Platform; label: string; color: string; hex: string; maxChars: number }[] = [
  { id: 'linkedin', label: 'LinkedIn', color: 'bg-[#0077B5]', hex: '#0077B5', maxChars: 3000 },
  { id: 'facebook', label: 'Facebook', color: 'bg-[#1877F2]', hex: '#1877F2', maxChars: 63206 },
  { id: 'twitter', label: 'Twitter/X', color: 'bg-[#1DA1F2]', hex: '#1DA1F2', maxChars: 280 },
  { id: 'instagram', label: 'Instagram', color: 'bg-[#E4405F]', hex: '#E4405F', maxChars: 2200 },
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
  return Math.min(charCount.value / activeCharLimit.value, 1.15)
})

const charColor = computed(() => {
  if (charCount.value > activeCharLimit.value) return 'text-red-500'
  if (charRatio.value > 0.9) return 'text-amber-500'
  if (charRatio.value > 0.75) return 'text-yellow-500'
  return 'text-gray-400'
})

const charRingColor = computed(() => {
  if (charCount.value > activeCharLimit.value) return '#ef4444'
  if (charRatio.value > 0.9) return '#f59e0b'
  if (charRatio.value > 0.75) return '#eab308'
  return '#6366f1'
})

const charRingDash = computed(() => {
  const circumference = 2 * Math.PI * 14
  const ratio = Math.min(charRatio.value, 1)
  const filled = ratio * circumference
  return `${filled} ${circumference - filled}`
})

const togglePlatform = (platform: Platform) => {
  const index = selectedPlatforms.value.indexOf(platform)
  if (index > -1) {
    selectedPlatforms.value.splice(index, 1)
  } else {
    selectedPlatforms.value.push(platform)
  }
}

const close = () => {
  emit('update:modelValue', false)
}

const save = () => {
  const scheduledAt = scheduledDate.value && scheduledTime.value
    ? new Date(`${scheduledDate.value}T${scheduledTime.value}`).toISOString()
    : undefined

  emit('save', {
    content: content.value,
    platforms: selectedPlatforms.value,
    scheduledAt,
    status: scheduledAt ? 'scheduled' : status.value,
  })
  close()
}

const textareaRef = ref<HTMLTextAreaElement | null>(null)

const autoResize = () => {
  const el = textareaRef.value
  if (el) {
    el.style.height = 'auto'
    el.style.height = `${Math.max(el.scrollHeight, 120)}px`
  }
}

watch(content, () => {
  nextTick(autoResize)
})

watch(() => props.editPost, (post) => {
  if (post) {
    content.value = post.content
    selectedPlatforms.value = [...post.platforms]
    if (post.scheduledAt) {
      const date = new Date(post.scheduledAt)
      scheduledDate.value = date.toISOString().split('T')[0]
      scheduledTime.value = date.toTimeString().slice(0, 5)
    }
    status.value = post.status
  } else {
    content.value = ''
    selectedPlatforms.value = []
    scheduledDate.value = ''
    scheduledTime.value = ''
    status.value = 'draft'
  }
}, { immediate: true })

watch(() => props.modelValue, (open) => {
  if (open) {
    nextTick(() => {
      textareaRef.value?.focus()
      autoResize()
    })
  }
})
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        @click="close"
      />
    </Transition>

    <!-- Slide-in Panel -->
    <Transition
      enter-active-class="transition ease-out duration-300 transform"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition ease-in duration-200 transform"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="modelValue"
        class="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xl bg-white shadow-2xl flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">
              {{ editPost ? 'Edit Post' : 'Create Post' }}
            </h2>
            <p class="text-xs text-gray-400 mt-0.5">
              {{ editPost ? 'Modify your post content and settings' : 'Write and schedule a new post' }}
            </p>
          </div>
          <button
            class="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-200"
            @click="close"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="flex-1 overflow-auto">
          <div class="p-6 space-y-6">
            <!-- Content Section -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm font-semibold text-gray-900">Content</label>
                <!-- Live character counter with ring -->
                <div class="flex items-center gap-2">
                  <span
                    class="text-xs font-medium transition-colors duration-200"
                    :class="charColor"
                  >
                    {{ charCount }} / {{ activeCharLimit }}
                  </span>
                  <div class="relative w-8 h-8">
                    <svg class="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        fill="none"
                        stroke="#e5e7eb"
                        stroke-width="2"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        fill="none"
                        :stroke="charRingColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        :stroke-dasharray="charRingDash"
                        class="transition-all duration-300"
                      />
                    </svg>
                    <span
                      v-if="charRatio > 0.9"
                      class="absolute inset-0 flex items-center justify-center text-[8px] font-bold"
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
                style="min-height: 120px"
                placeholder="What do you want to share?"
                @input="autoResize"
              />
              <!-- Platform char limit hints -->
              <div v-if="selectedPlatforms.length > 0" class="flex flex-wrap gap-2 mt-2">
                <span
                  v-for="pid in selectedPlatforms"
                  :key="pid"
                  class="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                  :class="charCount > (platforms.find(p => p.id === pid)?.maxChars || 0) ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :style="{ backgroundColor: platforms.find(p => p.id === pid)?.hex }"
                  />
                  {{ platforms.find(p => p.id === pid)?.label }}: {{ platforms.find(p => p.id === pid)?.maxChars }}
                </span>
              </div>
            </div>

            <!-- Platforms Section -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">Platforms</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="p in platforms"
                  :key="p.id"
                  class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-200"
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
                  <PlatformIcon :platform="p.id" size="xs" />
                  {{ p.label }}
                  <svg
                    v-if="selectedPlatforms.includes(p.id)"
                    class="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Media Upload Section -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">Media</label>
              <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-brand-400 hover:bg-brand-50/30 transition-all duration-200 cursor-pointer group/upload">
                <div class="w-10 h-10 bg-gray-100 group-hover/upload:bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-2.5 transition-all duration-200">
                  <ArrowUpTrayIcon class="w-5 h-5 text-gray-400 group-hover/upload:text-brand-500 transition-colors duration-200" />
                </div>
                <p class="text-sm font-medium text-gray-500 group-hover/upload:text-brand-600 transition-colors duration-200">
                  Drag & drop files or click to upload
                </p>
                <p class="text-xs text-gray-400 mt-1">PNG, JPG, GIF, MP4 up to 10MB</p>
              </div>
            </div>

            <!-- Schedule Section -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">Schedule</label>
              <div class="flex gap-3">
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
        </div>

        <!-- Sticky Footer -->
        <div class="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/80 flex-shrink-0">
          <button
            class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-xl transition-all duration-200"
            @click="close"
          >
            Cancel
          </button>
          <div class="flex gap-2">
            <button
              class="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              @click="status = 'draft'; save()"
            >
              Save Draft
            </button>
            <button
              class="px-5 py-2.5 text-sm font-semibold text-white bg-brand-500 rounded-xl hover:bg-brand-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-brand-500/25"
              :disabled="!content.trim() || selectedPlatforms.length === 0"
              @click="save()"
            >
              {{ scheduledDate ? 'Schedule' : 'Publish Now' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
