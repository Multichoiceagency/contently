<script setup lang="ts">
import {
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
} from '@heroicons/vue/24/outline'
import type { Post } from '~/types'

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
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200 group">
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-2">
        <PlatformIcon
          v-for="platform in post.platforms"
          :key="platform"
          :platform="platform"
          size="sm"
        />
        <StatusBadge :status="post.status" />
      </div>
      <div class="relative">
        <button
          class="p-1 text-gray-400 hover:text-gray-600 rounded opacity-0 group-hover:opacity-100 transition-all duration-200"
          @click="menuOpen = !menuOpen"
        >
          <EllipsisHorizontalIcon class="w-5 h-5" />
        </button>
        <div
          v-if="menuOpen"
          class="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[140px]"
        >
          <button
            class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            @click="emit('edit', post.id); menuOpen = false"
          >
            <PencilIcon class="w-4 h-4" />
            Edit
          </button>
          <button
            class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            @click="emit('delete', post.id); menuOpen = false"
          >
            <TrashIcon class="w-4 h-4" />
            Delete
          </button>
        </div>
        <div v-if="menuOpen" class="fixed inset-0 z-0" @click="menuOpen = false" />
      </div>
    </div>

    <!-- Content -->
    <p class="text-sm text-gray-700 leading-relaxed mb-4">{{ truncatedContent }}</p>

    <!-- Footer -->
    <div class="flex items-center justify-between pt-3 border-t border-gray-100">
      <div class="flex items-center gap-1 text-xs text-gray-400">
        <CalendarIcon class="w-3.5 h-3.5" />
        <span>{{ formattedDate }}</span>
      </div>
      <div v-if="post.status === 'published'" class="flex items-center gap-3 text-xs text-gray-400">
        <span class="flex items-center gap-1">
          <HeartIcon class="w-3.5 h-3.5" />
          {{ post.engagement.likes }}
        </span>
        <span class="flex items-center gap-1">
          <ChatBubbleLeftIcon class="w-3.5 h-3.5" />
          {{ post.engagement.comments }}
        </span>
        <span class="flex items-center gap-1">
          <ShareIcon class="w-3.5 h-3.5" />
          {{ post.engagement.shares }}
        </span>
      </div>
    </div>
  </div>
</template>
