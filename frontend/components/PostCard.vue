<script setup lang="ts">
import {
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  EyeIcon,
  CursorArrowRaysIcon,
} from '@heroicons/vue/24/outline'
import type { Post, Platform } from '~/types'

const props = defineProps<{
  post: Post
}>()

const emit = defineEmits<{
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}>()

const menuOpen = ref(false)

const formattedDate = computed(() => {
  const date = props.post.scheduledAt || props.post.publishedAt || props.post.createdAt
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

const truncatedContent = computed(() => {
  if (props.post.content.length > 140) {
    return props.post.content.slice(0, 140) + '...'
  }
  return props.post.content
})

const platformAccentColor = computed(() => {
  if (!props.post.platforms.length) return '#6366f1'
  const colors: Record<Platform, string> = {
    linkedin: '#0077B5',
    facebook: '#1877F2',
    twitter: '#1DA1F2',
    instagram: '#E4405F',
  }
  return colors[props.post.platforms[0]]
})

const totalEngagement = computed(() => {
  const { likes, comments, shares } = props.post.engagement
  return likes + comments + shares
})

const formatCount = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}
</script>

<template>
  <div
    class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
    :style="{ borderTopColor: platformAccentColor, borderTopWidth: '2px' }"
    @click="emit('edit', post.id)"
  >
    <!-- Image Thumbnail -->
    <div
      v-if="post.mediaUrls && post.mediaUrls.length > 0"
      class="relative h-40 overflow-hidden bg-gray-100"
    >
      <img
        :src="post.mediaUrls[0]"
        alt=""
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      <div v-if="post.mediaUrls.length > 1" class="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
        +{{ post.mediaUrls.length - 1 }}
      </div>
    </div>

    <div class="p-5">
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1">
            <PlatformIcon
              v-for="platform in post.platforms"
              :key="platform"
              :platform="platform"
              size="xs"
            />
          </div>
          <StatusBadge :status="post.status" />
        </div>
        <div class="relative" @click.stop>
          <button
            class="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-200"
            @click="menuOpen = !menuOpen"
          >
            <EllipsisHorizontalIcon class="w-5 h-5" />
          </button>
          <!-- Dropdown Menu -->
          <Transition
            enter-active-class="transition ease-out duration-150"
            enter-from-class="opacity-0 scale-95 translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition ease-in duration-100"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="menuOpen"
              class="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-10 min-w-[160px]"
            >
              <button
                class="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                @click="emit('edit', post.id); menuOpen = false"
              >
                <PencilIcon class="w-4 h-4 text-gray-400" />
                Edit
              </button>
              <button
                class="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                @click="menuOpen = false"
              >
                <DocumentDuplicateIcon class="w-4 h-4 text-gray-400" />
                Duplicate
              </button>
              <button
                class="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                @click="menuOpen = false"
              >
                <ClockIcon class="w-4 h-4 text-gray-400" />
                Reschedule
              </button>
              <div class="my-1 border-t border-gray-100" />
              <button
                class="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                @click="emit('delete', post.id); menuOpen = false"
              >
                <TrashIcon class="w-4 h-4" />
                Delete
              </button>
            </div>
          </Transition>
          <div v-if="menuOpen" class="fixed inset-0 z-0" @click="menuOpen = false" />
        </div>
      </div>

      <!-- Content -->
      <p class="text-sm text-gray-700 leading-relaxed mb-4 group-hover:text-gray-900 transition-colors duration-200">
        {{ truncatedContent }}
      </p>

      <!-- Engagement Metrics Row -->
      <div
        v-if="post.status === 'published'"
        class="flex items-center gap-4 mb-3 py-2.5 px-3 -mx-1 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center gap-1 text-xs text-gray-500">
          <HeartIcon class="w-3.5 h-3.5 text-red-400" />
          <span class="font-medium">{{ formatCount(post.engagement.likes) }}</span>
        </div>
        <div class="flex items-center gap-1 text-xs text-gray-500">
          <ChatBubbleLeftIcon class="w-3.5 h-3.5 text-blue-400" />
          <span class="font-medium">{{ formatCount(post.engagement.comments) }}</span>
        </div>
        <div class="flex items-center gap-1 text-xs text-gray-500">
          <ShareIcon class="w-3.5 h-3.5 text-green-400" />
          <span class="font-medium">{{ formatCount(post.engagement.shares) }}</span>
        </div>
        <div class="flex items-center gap-1 text-xs text-gray-500 ml-auto">
          <EyeIcon class="w-3.5 h-3.5 text-gray-400" />
          <span class="font-medium">{{ formatCount(post.engagement.impressions) }}</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-3 border-t border-gray-100">
        <div class="flex items-center gap-1.5 text-xs text-gray-400">
          <CalendarIcon class="w-3.5 h-3.5" />
          <span>{{ formattedDate }}</span>
        </div>
        <div
          v-if="post.status === 'published' && totalEngagement > 0"
          class="flex items-center gap-1 text-xs"
        >
          <CursorArrowRaysIcon class="w-3.5 h-3.5 text-brand-400" />
          <span class="font-medium text-brand-600">{{ formatCount(post.engagement.clicks) }} clicks</span>
        </div>
      </div>
    </div>
  </div>
</template>
