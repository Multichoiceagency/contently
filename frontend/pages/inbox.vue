<script setup lang="ts">
import {
  InboxIcon,
  SparklesIcon,
  PaperAirplaneIcon,
  EllipsisHorizontalIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  VideoCameraIcon,
  FaceSmileIcon,
  PaperClipIcon,
  CheckIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/outline'

const { addToast } = useToast()

const selectedPlatform = ref('all')
const selectedConversation = ref<string | null>('1')
const replyText = ref('')
const searchQuery = ref('')
const isTyping = ref(false)
const showSuggestions = ref(true)

const platformTabs = [
  { id: 'all', label: 'All', count: 0 },
  { id: 'linkedin', label: 'LinkedIn', count: 0 },
  { id: 'facebook', label: 'Facebook', count: 0 },
  { id: 'twitter', label: 'Twitter/X', count: 0 },
  { id: 'instagram', label: 'Instagram', count: 0 },
]

interface Message {
  id: string
  sender: string
  avatar: string
  content: string
  time: string
  isMe: boolean
  status?: 'sent' | 'delivered' | 'read'
}

interface Conversation {
  id: string
  name: string
  platform: 'linkedin' | 'facebook' | 'twitter' | 'instagram'
  lastMessage: string
  time: string
  unread: boolean
  online?: boolean
  messages: Message[]
}

const conversations = ref<Conversation[]>([])

const aiSuggestions = [
  'Thank you for reaching out!',
  'I would be happy to help.',
  'Let me look into that for you.',
  'Great question!',
]

const filteredConversations = computed(() => {
  let filtered = conversations.value
  if (selectedPlatform.value !== 'all') {
    filtered = filtered.filter(c => c.platform === selectedPlatform.value)
  }
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(query) || c.lastMessage.toLowerCase().includes(query)
    )
  }
  return filtered
})

const activeConversation = computed(() => {
  return conversations.value.find(c => c.id === selectedConversation.value)
})

const unreadCount = computed(() => conversations.value.filter(c => c.unread).length)

const selectConversation = (id: string) => {
  selectedConversation.value = id
  const conv = conversations.value.find(c => c.id === id)
  if (conv) conv.unread = false
}

const sendReply = () => {
  if (!replyText.value.trim() || !activeConversation.value) return
  activeConversation.value.messages.push({
    id: Date.now().toString(),
    sender: 'You',
    avatar: 'JD',
    content: replyText.value,
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    isMe: true,
    status: 'sent',
  })
  activeConversation.value.lastMessage = replyText.value
  activeConversation.value.time = 'Just now'
  replyText.value = ''
  showSuggestions.value = false

  // Simulate typing indicator after sending
  setTimeout(() => {
    isTyping.value = true
    setTimeout(() => {
      isTyping.value = false
    }, 3000)
  }, 1500)
}

const useSuggestion = (suggestion: string) => {
  replyText.value = suggestion
  showSuggestions.value = false
}

const aiQuickReply = () => {
  const replies = [
    'Thank you for reaching out! I would be happy to help.',
    'That is a great question! Let me get back to you with more details.',
    'Appreciate the kind words! We are always working to improve.',
    'I will look into that and get back to you shortly.',
  ]
  replyText.value = replies[Math.floor(Math.random() * replies.length)]
  showSuggestions.value = false
  addToast('AI suggested a reply', 'info')
}

const getStatusIcon = (status?: string) => {
  if (status === 'read') return CheckCircleIcon
  if (status === 'delivered') return CheckIcon
  return CheckIcon
}
</script>

<template>
  <div>
    <AppTopbar title="Inbox" subtitle="Manage conversations across your social accounts.">
      <template #action>
        <div v-if="unreadCount > 0" class="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold">
          <EnvelopeIcon class="w-4 h-4" />
          {{ unreadCount }} unread
        </div>
      </template>
    </AppTopbar>

    <div class="flex h-[calc(100vh-64px)]">
      <!-- Conversations List -->
      <div class="w-80 border-r border-gray-200 bg-white flex flex-col">
        <!-- Search -->
        <div class="px-3 pt-3 pb-2">
          <div class="relative">
            <MagnifyingGlassIcon class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search conversations..."
              class="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white transition-all duration-200"
            />
          </div>
        </div>

        <!-- Platform Tabs -->
        <div class="flex items-center gap-1 px-3 py-2 border-b border-gray-100 overflow-x-auto scrollbar-hide">
          <button
            v-for="tab in platformTabs"
            :key="tab.id"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200"
            :class="
              selectedPlatform === tab.id
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            "
            @click="selectedPlatform = tab.id"
          >
            <PlatformIcon v-if="tab.id !== 'all'" :platform="(tab.id as any)" size="xs" />
            {{ tab.label }}
            <span
              v-if="tab.id === 'all' && unreadCount > 0"
              class="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
              :class="selectedPlatform === tab.id ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'"
            >
              {{ unreadCount }}
            </span>
          </button>
        </div>

        <!-- Conversation List -->
        <div class="flex-1 overflow-y-auto">
          <div
            v-for="conv in filteredConversations"
            :key="conv.id"
            class="flex items-start gap-3 px-4 py-3.5 cursor-pointer border-b border-gray-50 transition-all duration-200"
            :class="selectedConversation === conv.id ? 'bg-indigo-50/70 border-l-2 border-l-indigo-500' : 'hover:bg-gray-50 border-l-2 border-l-transparent'"
            @click="selectConversation(conv.id)"
          >
            <div class="relative flex-shrink-0">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span class="text-sm font-semibold text-gray-600">{{ conv.name.charAt(0) }}</span>
              </div>
              <!-- Platform icon badge -->
              <div class="absolute -bottom-0.5 -right-0.5">
                <PlatformIcon :platform="conv.platform" size="xs" />
              </div>
              <!-- Online indicator -->
              <div
                v-if="conv.online"
                class="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white"
              />
              <!-- Unread indicator -->
              <div
                v-if="conv.unread"
                class="absolute -top-0.5 -left-0.5 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-0.5">
                <span
                  class="text-sm truncate"
                  :class="conv.unread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'"
                >
                  {{ conv.name }}
                </span>
                <span class="text-[10px] text-gray-400 flex-shrink-0 ml-2">{{ conv.time }}</span>
              </div>
              <p
                class="text-xs truncate"
                :class="conv.unread ? 'font-medium text-gray-700' : 'text-gray-500'"
              >
                {{ conv.lastMessage }}
              </p>
            </div>
          </div>

          <!-- Empty search state -->
          <div v-if="filteredConversations.length === 0" class="flex flex-col items-center justify-center py-12 px-4">
            <MagnifyingGlassIcon class="w-8 h-8 text-gray-300 mb-2" />
            <p class="text-sm text-gray-500">No conversations found</p>
          </div>
        </div>
      </div>

      <!-- Message Thread -->
      <div class="flex-1 flex flex-col bg-gray-50">
        <template v-if="activeConversation">
          <!-- Thread Header -->
          <div class="flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-200">
            <div class="flex items-center gap-3">
              <div class="relative">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span class="text-sm font-semibold text-gray-600">{{ activeConversation.name.charAt(0) }}</span>
                </div>
                <div
                  v-if="activeConversation.online"
                  class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"
                />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-gray-900">{{ activeConversation.name }}</h3>
                <div class="flex items-center gap-1.5">
                  <PlatformIcon :platform="activeConversation.platform" size="xs" />
                  <span class="text-xs text-gray-500 capitalize">{{ activeConversation.platform }}</span>
                  <span v-if="activeConversation.online" class="text-xs text-emerald-500 font-medium">- Online</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200">
                <PhoneIcon class="w-5 h-5" />
              </button>
              <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200">
                <VideoCameraIcon class="w-5 h-5" />
              </button>
              <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200">
                <EllipsisHorizontalIcon class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Messages -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <div
              v-for="msg in activeConversation.messages"
              :key="msg.id"
              class="flex items-end gap-2"
              :class="msg.isMe ? 'justify-end' : 'justify-start'"
            >
              <!-- Sender avatar (left side only) -->
              <div
                v-if="!msg.isMe"
                class="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0"
              >
                <span class="text-[10px] font-bold text-gray-600">{{ msg.avatar }}</span>
              </div>
              <div class="max-w-md">
                <div
                  class="px-4 py-2.5 rounded-2xl shadow-sm"
                  :class="
                    msg.isMe
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-md'
                      : 'bg-white text-gray-700 border border-gray-100 rounded-bl-md'
                  "
                >
                  <p class="text-sm leading-relaxed">{{ msg.content }}</p>
                </div>
                <div
                  class="flex items-center gap-1 mt-1 px-1"
                  :class="msg.isMe ? 'justify-end' : 'justify-start'"
                >
                  <p class="text-[10px] text-gray-400">
                    {{ msg.time }}
                  </p>
                  <!-- Message status -->
                  <component
                    v-if="msg.isMe && msg.status"
                    :is="getStatusIcon(msg.status)"
                    class="w-3 h-3"
                    :class="msg.status === 'read' ? 'text-indigo-500' : 'text-gray-400'"
                  />
                </div>
              </div>
            </div>

            <!-- Typing Indicator -->
            <div v-if="isTyping" class="flex items-end gap-2 justify-start">
              <div class="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0">
                <span class="text-[10px] font-bold text-gray-600">{{ activeConversation.messages[0]?.avatar }}</span>
              </div>
              <div class="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div class="flex items-center gap-1">
                  <div class="typing-dot w-2 h-2 bg-gray-400 rounded-full" style="animation-delay: 0s" />
                  <div class="typing-dot w-2 h-2 bg-gray-400 rounded-full" style="animation-delay: 0.2s" />
                  <div class="typing-dot w-2 h-2 bg-gray-400 rounded-full" style="animation-delay: 0.4s" />
                </div>
              </div>
            </div>
          </div>

          <!-- Reply Input -->
          <div class="bg-white border-t border-gray-200">
            <!-- AI Suggestion Chips -->
            <div v-if="showSuggestions && !replyText" class="px-4 pt-3 pb-0">
              <div class="flex items-center gap-1.5 mb-2">
                <SparklesIcon class="w-3.5 h-3.5 text-indigo-500" />
                <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Suggested replies</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="suggestion in aiSuggestions"
                  :key="suggestion"
                  class="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-all duration-200 border border-indigo-100"
                  @click="useSuggestion(suggestion)"
                >
                  {{ suggestion }}
                </button>
              </div>
            </div>

            <div class="p-4">
              <div class="flex items-end gap-3">
                <div class="flex-1 relative">
                  <textarea
                    v-model="replyText"
                    rows="2"
                    class="w-full px-4 py-2.5 pr-16 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 resize-none transition-all duration-200"
                    placeholder="Type your reply..."
                    @keydown.enter.exact.prevent="sendReply"
                    @focus="showSuggestions = true"
                  />
                  <div class="absolute right-2 bottom-2 flex items-center gap-1">
                    <button class="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors">
                      <FaceSmileIcon class="w-4 h-4" />
                    </button>
                    <button class="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors">
                      <PaperClipIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    class="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all duration-200"
                    title="AI Quick Reply"
                    @click="aiQuickReply"
                  >
                    <SparklesIcon class="w-4 h-4" />
                    AI
                  </button>
                  <button
                    class="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-sm"
                    :disabled="!replyText.trim()"
                    @click="sendReply"
                  >
                    <PaperAirplaneIcon class="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Empty State -->
        <template v-else>
          <div class="flex-1 flex items-center justify-center">
            <div class="text-center">
              <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center mx-auto mb-4">
                <InboxIcon class="w-10 h-10 text-indigo-400" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
              <p class="text-sm text-gray-500 mb-6 max-w-sm">
                Select a conversation from the list or connect your social accounts to start receiving messages.
              </p>
              <!-- Connected platform icons -->
              <div class="flex items-center justify-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#0077B5]/10 flex items-center justify-center" title="LinkedIn">
                  <PlatformIcon platform="linkedin" size="sm" />
                </div>
                <div class="w-10 h-10 rounded-xl bg-[#1877F2]/10 flex items-center justify-center" title="Facebook">
                  <PlatformIcon platform="facebook" size="sm" />
                </div>
                <div class="w-10 h-10 rounded-xl bg-[#1DA1F2]/10 flex items-center justify-center" title="Twitter">
                  <PlatformIcon platform="twitter" size="sm" />
                </div>
                <div class="w-10 h-10 rounded-xl bg-[#E4405F]/10 flex items-center justify-center" title="Instagram">
                  <PlatformIcon platform="instagram" size="sm" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Typing indicator animation */
.typing-dot {
  animation: typing-bounce 1.4s ease-in-out infinite;
}

@keyframes typing-bounce {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}
</style>
