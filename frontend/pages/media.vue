<script setup lang="ts">
import {
  PhotoIcon,
  VideoCameraIcon,
  FolderIcon,
  PlusIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  TrashIcon,
  ArrowDownTrayIcon,
} from '@heroicons/vue/24/outline'

const { addToast } = useToast()

const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const mediaItems = ref<any[]>([])
const uploading = ref(false)
const dragOver = ref(false)

const fileInput = ref<HTMLInputElement | null>(null)

const handleUpload = () => {
  fileInput.value?.click()
}

const handleFiles = async (files: FileList | null) => {
  if (!files || files.length === 0) return
  uploading.value = true

  for (const file of Array.from(files)) {
    // TODO: POST /api/media/upload with FormData
    mediaItems.value.unshift({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      type: file.type.startsWith('video') ? 'video' : 'image',
      size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
      url: URL.createObjectURL(file),
      createdAt: new Date().toISOString(),
    })
  }

  uploading.value = false
  addToast(`${files.length} file(s) uploaded`, 'success')
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  dragOver.value = false
  handleFiles(e.dataTransfer?.files || null)
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  dragOver.value = true
}

const deleteItem = (id: string) => {
  mediaItems.value = mediaItems.value.filter(m => m.id !== id)
  addToast('File deleted', 'success')
}
</script>

<template>
  <div>
    <AppTopbar title="Media Library" subtitle="Upload and manage your images, videos, and files." />

    <div class="p-6 space-y-6">
      <!-- Toolbar -->
      <div class="flex items-center justify-between gap-4">
        <div class="relative flex-1 max-w-md">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search files..."
            class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div class="flex items-center gap-2">
          <div class="flex items-center bg-white border border-gray-200 rounded-xl p-1">
            <button
              class="p-2 rounded-lg transition-all"
              :class="viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-600'"
              @click="viewMode = 'grid'"
            >
              <Squares2X2Icon class="w-4 h-4" />
            </button>
            <button
              class="p-2 rounded-lg transition-all"
              :class="viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-600'"
              @click="viewMode = 'list'"
            >
              <ListBulletIcon class="w-4 h-4" />
            </button>
          </div>

          <button
            class="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all"
            @click="handleUpload"
          >
            <CloudArrowUpIcon class="w-4 h-4" />
            Upload
          </button>
          <input ref="fileInput" type="file" class="hidden" multiple accept="image/*,video/*" @change="handleFiles(($event.target as HTMLInputElement).files)" />
        </div>
      </div>

      <!-- Drop Zone / Empty State -->
      <div
        v-if="mediaItems.length === 0"
        class="border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-200"
        :class="dragOver ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-gray-50/50'"
        @drop="handleDrop"
        @dragover="handleDragOver"
        @dragleave="dragOver = false"
      >
        <div class="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <CloudArrowUpIcon class="w-8 h-8 text-indigo-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Upload your media</h3>
        <p class="text-sm text-gray-500 mb-6">Drag and drop files here, or click upload. Supports images and videos.</p>
        <button
          class="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm"
          @click="handleUpload"
        >
          Choose Files
        </button>
      </div>

      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <!-- Upload card -->
        <button
          class="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all"
          @click="handleUpload"
          @drop="handleDrop"
          @dragover="handleDragOver"
          @dragleave="dragOver = false"
        >
          <PlusIcon class="w-8 h-8 text-gray-400" />
          <span class="text-xs text-gray-500 font-medium">Upload</span>
        </button>

        <div
          v-for="item in mediaItems"
          :key="item.id"
          class="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-all"
        >
          <img v-if="item.type === 'image'" :src="item.url" class="w-full h-full object-cover" :alt="item.name" />
          <div v-else class="w-full h-full flex items-center justify-center">
            <VideoCameraIcon class="w-12 h-12 text-gray-400" />
          </div>

          <!-- Overlay -->
          <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <div class="flex-1">
              <p class="text-white text-xs font-medium truncate">{{ item.name }}</p>
              <p class="text-white/60 text-[10px]">{{ item.size }}</p>
            </div>
            <button class="p-1.5 bg-white/20 rounded-lg hover:bg-red-500/80 transition-colors" @click="deleteItem(item.id)">
              <TrashIcon class="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        <div
          v-for="item in mediaItems"
          :key="item.id"
          class="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-all"
        >
          <div class="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img v-if="item.type === 'image'" :src="item.url" class="w-full h-full object-cover" :alt="item.name" />
            <div v-else class="w-full h-full flex items-center justify-center">
              <VideoCameraIcon class="w-6 h-6 text-gray-400" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</p>
            <p class="text-xs text-gray-500">{{ item.size }}</p>
          </div>
          <span class="text-xs text-gray-400">{{ new Date(item.createdAt).toLocaleDateString() }}</span>
          <button class="p-2 text-gray-400 hover:text-red-500 transition-colors" @click="deleteItem(item.id)">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
