<script setup lang="ts">
import {
  ShieldCheckIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  ChatBubbleLeftEllipsisIcon,
  PaperAirplaneIcon,
  FunnelIcon,
} from '@heroicons/vue/24/outline'

const { addToast } = useToast()

const activeTab = ref('pending')
const pendingItems = ref<any[]>([])
const approvedItems = ref<any[]>([])
const rejectedItems = ref<any[]>([])

const tabs = [
  { id: 'pending', label: 'Pending', count: pendingItems },
  { id: 'approved', label: 'Approved', count: approvedItems },
  { id: 'rejected', label: 'Rejected', count: rejectedItems },
]
</script>

<template>
  <div>
    <AppTopbar title="Approval Workflow" subtitle="Review and approve content before publishing." />

    <div class="p-6 space-y-6">
      <!-- Tabs -->
      <div class="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1 w-fit">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
          :class="activeTab === tab.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
          <span
            v-if="tab.count.value.length > 0"
            class="px-1.5 py-0.5 text-[10px] font-bold rounded-full"
            :class="activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'"
          >
            {{ tab.count.value.length }}
          </span>
        </button>
      </div>

      <!-- Empty State -->
      <div class="flex flex-col items-center justify-center py-20">
        <div class="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-6">
          <ShieldCheckIcon class="w-10 h-10 text-emerald-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Content approval workflow</h3>
        <p class="text-sm text-gray-500 max-w-md text-center mb-6">
          Set up approval workflows so team members can submit content for review before publishing. Approve or request changes with inline comments.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
          <div class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
            <div class="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <PaperAirplaneIcon class="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">Submit</p>
              <p class="text-[11px] text-gray-500">Team submits for review</p>
            </div>
          </div>
          <div class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
            <div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <ChatBubbleLeftEllipsisIcon class="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">Review</p>
              <p class="text-[11px] text-gray-500">Add comments & feedback</p>
            </div>
          </div>
          <div class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
            <div class="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckIcon class="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">Approve</p>
              <p class="text-[11px] text-gray-500">Approve & schedule</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
