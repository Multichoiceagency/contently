<script setup lang="ts">
import { SparklesIcon } from '@heroicons/vue/24/outline'
import type { Platform, AiTone, AiContentType } from '~/types'

const emit = defineEmits<{
  (e: 'generate', data: {
    topic: string
    platform: Platform
    tone: AiTone
    contentType: AiContentType
  }): void
}>()

const topic = ref('')
const selectedPlatform = ref<Platform>('linkedin')
const selectedTone = ref<AiTone>('professional')
const selectedContentType = ref<AiContentType>('full-post')
const loading = ref(false)

const platforms: { id: Platform; label: string }[] = [
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'twitter', label: 'Twitter/X' },
  { id: 'instagram', label: 'Instagram' },
]

const tones: { id: AiTone; label: string; emoji: string }[] = [
  { id: 'professional', label: 'Professional', emoji: '' },
  { id: 'casual', label: 'Casual', emoji: '' },
  { id: 'fun', label: 'Fun', emoji: '' },
  { id: 'inspiring', label: 'Inspiring', emoji: '' },
]

const contentTypes: { id: AiContentType; label: string }[] = [
  { id: 'full-post', label: 'Full Post' },
  { id: 'caption', label: 'Caption' },
  { id: 'hashtags', label: 'Hashtags' },
  { id: 'ideas', label: 'Content Ideas' },
]

const generate = async () => {
  if (!topic.value.trim()) return
  loading.value = true
  emit('generate', {
    topic: topic.value,
    platform: selectedPlatform.value,
    tone: selectedTone.value,
    contentType: selectedContentType.value,
  })
  // Loading state will be turned off by parent
  setTimeout(() => { loading.value = false }, 2000)
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-6">Generate Content</h3>

    <div class="space-y-5">
      <!-- Topic -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Topic or Product</label>
        <input
          v-model="topic"
          type="text"
          placeholder="e.g., New product launch, industry trends..."
          class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      <!-- Platform -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Platform</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="p in platforms"
            :key="p.id"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-200"
            :class="
              selectedPlatform === p.id
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            "
            @click="selectedPlatform = p.id"
          >
            <PlatformIcon :platform="p.id" size="xs" />
            {{ p.label }}
          </button>
        </div>
      </div>

      <!-- Tone -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Tone</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="t in tones"
            :key="t.id"
            class="px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-200"
            :class="
              selectedTone === t.id
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            "
            @click="selectedTone = t.id"
          >
            {{ t.label }}
          </button>
        </div>
      </div>

      <!-- Content Type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="ct in contentTypes"
            :key="ct.id"
            class="px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-200"
            :class="
              selectedContentType === ct.id
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            "
            @click="selectedContentType = ct.id"
          >
            {{ ct.label }}
          </button>
        </div>
      </div>

      <!-- Generate Button -->
      <button
        class="w-full flex items-center justify-center gap-2 bg-brand-500 text-white py-3 rounded-xl text-sm font-semibold hover:bg-brand-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!topic.trim() || loading"
        @click="generate"
      >
        <LoadingSpinner v-if="loading" size="sm" />
        <template v-else>
          <SparklesIcon class="w-5 h-5" />
          Generate Content
        </template>
      </button>
    </div>
  </div>
</template>
