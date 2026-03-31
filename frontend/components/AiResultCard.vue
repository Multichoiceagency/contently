<script setup lang="ts">
import {
  ClipboardDocumentIcon,
  DocumentPlusIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  content: string
  platform?: string
  tone?: string
}>()

const emit = defineEmits<{
  (e: 'useInPost', content: string): void
}>()

const copied = ref(false)

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.content)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Fallback
    const textarea = document.createElement('textarea')
    textarea.value = props.content
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200">
    <div class="flex items-start gap-3 mb-3">
      <div v-if="platform" class="flex items-center gap-2">
        <PlatformIcon :platform="(platform as any)" size="sm" />
      </div>
      <span v-if="tone" class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
        {{ tone }}
      </span>
    </div>

    <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
      {{ content }}
    </p>

    <div class="flex items-center gap-2 pt-3 border-t border-gray-100">
      <button
        class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200"
        :class="copied ? 'text-green-600 bg-green-50' : 'text-gray-600 hover:bg-gray-100'"
        @click="copyToClipboard"
      >
        <CheckIcon v-if="copied" class="w-4 h-4" />
        <ClipboardDocumentIcon v-else class="w-4 h-4" />
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
      <button
        class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition-all duration-200"
        @click="emit('useInPost', content)"
      >
        <DocumentPlusIcon class="w-4 h-4" />
        Use in Post
      </button>
    </div>
  </div>
</template>
