<script setup lang="ts">
import {
  XMarkIcon,
  PhotoIcon,
  CalendarIcon,
  ClockIcon,
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
const maxChars = 280

const platforms: { id: Platform; label: string; color: string }[] = [
  { id: 'linkedin', label: 'LinkedIn', color: 'bg-[#0077B5]' },
  { id: 'facebook', label: 'Facebook', color: 'bg-[#1877F2]' },
  { id: 'twitter', label: 'Twitter/X', color: 'bg-[#1DA1F2]' },
  { id: 'instagram', label: 'Instagram', color: 'bg-[#E4405F]' },
]

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
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50" @click="close" />

        <!-- Modal -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">
              {{ editPost ? 'Edit Post' : 'Create Post' }}
            </h2>
            <button
              class="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200"
              @click="close"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-6">
            <!-- Content -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                v-model="content"
                rows="5"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none transition-all duration-200"
                placeholder="What do you want to share?"
              />
              <div class="flex justify-end mt-1">
                <span
                  class="text-xs"
                  :class="charCount > maxChars ? 'text-red-500' : 'text-gray-400'"
                >
                  {{ charCount }} / {{ maxChars }}
                </span>
              </div>
            </div>

            <!-- Platforms -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="p in platforms"
                  :key="p.id"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-200"
                  :class="
                    selectedPlatforms.includes(p.id)
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  "
                  @click="togglePlatform(p.id)"
                >
                  <PlatformIcon :platform="p.id" size="xs" />
                  {{ p.label }}
                </button>
              </div>
            </div>

            <!-- Media Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Media</label>
              <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-brand-400 transition-all duration-200 cursor-pointer">
                <PhotoIcon class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p class="text-sm text-gray-500">Drag & drop files or click to upload</p>
                <p class="text-xs text-gray-400 mt-1">PNG, JPG, GIF, MP4 up to 10MB</p>
              </div>
            </div>

            <!-- Schedule -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
              <div class="flex gap-3">
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

          <!-- Footer -->
          <div class="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <button
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-all duration-200"
              @click="close"
            >
              Cancel
            </button>
            <div class="flex gap-2">
              <button
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                @click="status = 'draft'; save()"
              >
                Save as Draft
              </button>
              <button
                class="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!content.trim() || selectedPlatforms.length === 0"
                @click="save()"
              >
                {{ scheduledDate ? 'Schedule' : 'Publish Now' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
