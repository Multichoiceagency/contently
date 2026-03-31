<script setup lang="ts">
import {
  InboxIcon,
  SparklesIcon,
  PaperAirplaneIcon,
  FunnelIcon,
  EllipsisHorizontalIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline'

const { addToast } = useToast()

const selectedPlatform = ref('all')
const selectedConversation = ref<string | null>('1')
const replyText = ref('')
const searchQuery = ref('')

const platformTabs = [
  { id: 'all', label: 'All' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'twitter', label: 'Twitter/X' },
  { id: 'instagram', label: 'Instagram' },
]

interface Message {
  id: string
  sender: string
  avatar: string
  content: string
  time: string
  isMe: boolean
}

interface Conversation {
  id: string
  name: string
  platform: 'linkedin' | 'facebook' | 'twitter' | 'instagram'
  lastMessage: string
  time: string
  unread: boolean
  messages: Message[]
}

const conversations = ref<Conversation[]>([
  {
    id: '1',
    name: 'Sarah Johnson',
    platform: 'linkedin',
    lastMessage: 'Thanks for sharing that article! Really insightful.',
    time: '2m ago',
    unread: true,
    messages: [
      { id: '1', sender: 'Sarah Johnson', avatar: 'SJ', content: 'Hi there! I saw your latest post about AI in marketing. Really great insights!', time: '10:30 AM', isMe: false },
      { id: '2', sender: 'You', avatar: 'JD', content: 'Thank you, Sarah! We have been doing a lot of research on how AI can transform social media strategies.', time: '10:32 AM', isMe: true },
      { id: '3', sender: 'Sarah Johnson', avatar: 'SJ', content: 'Would love to collaborate on a piece about this topic. Are you open to that?', time: '10:35 AM', isMe: false },
      { id: '4', sender: 'You', avatar: 'JD', content: 'Absolutely! Let us set up a time to discuss. How does next Tuesday work?', time: '10:38 AM', isMe: true },
      { id: '5', sender: 'Sarah Johnson', avatar: 'SJ', content: 'Thanks for sharing that article! Really insightful.', time: '10:40 AM', isMe: false },
    ],
  },
  {
    id: '2',
    name: 'Tech Community',
    platform: 'facebook',
    lastMessage: 'Great post! Can you share more details about the launch?',
    time: '15m ago',
    unread: true,
    messages: [
      { id: '1', sender: 'Mike Chen', avatar: 'MC', content: 'Great post! Can you share more details about the launch?', time: '10:15 AM', isMe: false },
    ],
  },
  {
    id: '3',
    name: '@designfan',
    platform: 'twitter',
    lastMessage: 'Love the new branding! Who designed it?',
    time: '1h ago',
    unread: false,
    messages: [
      { id: '1', sender: '@designfan', avatar: 'DF', content: 'Love the new branding! Who designed it?', time: '9:30 AM', isMe: false },
      { id: '2', sender: 'You', avatar: 'JD', content: 'Thank you! Our in-house design team worked on the rebrand. Glad you like it!', time: '9:45 AM', isMe: true },
    ],
  },
  {
    id: '4',
    name: 'Emma Williams',
    platform: 'instagram',
    lastMessage: 'The behind-the-scenes content is amazing!',
    time: '3h ago',
    unread: false,
    messages: [
      { id: '1', sender: 'Emma Williams', avatar: 'EW', content: 'The behind-the-scenes content is amazing! Keep it up!', time: '7:20 AM', isMe: false },
    ],
  },
  {
    id: '5',
    name: 'David Park',
    platform: 'linkedin',
    lastMessage: 'Interested in your enterprise plan. Can we schedule a call?',
    time: '5h ago',
    unread: false,
    messages: [
      { id: '1', sender: 'David Park', avatar: 'DP', content: 'Hi, I am interested in your enterprise plan. Can we schedule a call to discuss?', time: '5:00 AM', isMe: false },
    ],
  },
])

const filteredConversations = computed(() => {
  let result = conversations.value
  if (selectedPlatform.value !== 'all') {
    result = result.filter(c => c.platform === selectedPlatform.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(c => c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q))
  }
  return result
})

const activeConversation = computed(() => {
  return conversations.value.find(c => c.id === selectedConversation.value)
})

const unreadCount = computed(() => {
  return conversations.value.filter(c => c.unread).length
})

const platformColor = (platform: string) => {
  const colors: Record<string, string> = {
    linkedin: 'bg-[#0077B5]',
    facebook: 'bg-[#1877F2]',
    twitter: 'bg-[#1DA1F2]',
    instagram: 'bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F56040]',
  }
  return colors[platform] || 'bg-gray-400'
}

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
  })
  activeConversation.value.lastMessage = replyText.value
  activeConversation.value.time = 'Just now'
  replyText.value = ''
}

const aiQuickReply = () => {
  const replies = [
    'Thank you for reaching out! I would be happy to help.',
    'That is a great question! Let me get back to you with more details.',
    'Appreciate the kind words! We are always working to improve.',
    'I will look into that and get back to you shortly.',
  ]
  replyText.value = replies[Math.floor(Math.random() * replies.length)]
  addToast('AI suggested a reply', 'info')
}
</script>

<template>
  <div>
    <AppTopbar title="Inbox" subtitle="Manage conversations across your social accounts.">
      <template #action><span /></template>
    </AppTopbar>

    <div class="flex h-[calc(100vh-64px)]">
      <!-- Conversations List -->
      <div class="w-[340px] border-r border-gray-200 bg-white flex flex-col">
        <!-- Search -->
        <div class="px-4 pt-4 pb-2">
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search conversations..."
              class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
            />
          </div>
        </div>

        <!-- Platform Tabs -->
        <div class="flex items-center gap-1 px-4 py-2 border-b border-gray-100 overflow-x-auto">
          <button
            v-for="tab in platformTabs"
            :key="tab.id"
            class="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200"
            :class="
              selectedPlatform === tab.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            "
            @click="selectedPlatform = tab.id"
          >
            {{ tab.label }}
            <span
              v-if="tab.id === 'all' && unreadCount > 0"
              class="ml-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full"
              :class="selectedPlatform === 'all' ? 'bg-white/20 text-white' : 'bg-red-500 text-white'"
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
            :class="selectedConversation === conv.id ? 'bg-indigo-50/60 border-l-2 border-l-indigo-500' : 'hover:bg-gray-50 border-l-2 border-l-transparent'"
            @click="selectConversation(conv.id)"
          >
            <div class="relative flex-shrink-0">
              <div class="w-11 h-11 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span class="text-sm font-semibold text-gray-600">{{ conv.name.charAt(0) }}</span>
              </div>
              <!-- Platform badge -->
              <div
                class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white"
                :class="platformColor(conv.platform)"
              >
                <span class="text-[6px] text-white font-bold">{{ conv.platform.charAt(0).toUpperCase() }}</span>
              </div>
              <!-- Unread dot -->
              <div
                v-if="conv.unread"
                class="absolute -top-0.5 -left-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
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

          <!-- Empty state -->
          <div v-if="filteredConversations.length === 0" class="flex items-center justify-center py-12">
            <div class="text-center">
              <InboxIcon class="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p class="text-sm text-gray-500">No conversations found</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Thread -->
      <div class="flex-1 flex flex-col bg-gray-50/50">
        <template v-if="activeConversation">
          <!-- Thread Header -->
          <div class="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span class="text-sm font-semibold text-gray-600">{{ activeConversation.name.charAt(0) }}</span>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-gray-900">{{ activeConversation.name }}</h3>
                <div class="flex items-center gap-1.5">
                  <PlatformIcon :platform="activeConversation.platform" size="xs" />
                  <span class="text-xs text-gray-500 capitalize">{{ activeConversation.platform }}</span>
                  <span class="text-xs text-gray-300">-</span>
                  <span class="text-xs text-green-500 font-medium">Online</span>
                </div>
              </div>
            </div>
            <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200">
              <EllipsisHorizontalIcon class="w-5 h-5" />
            </button>
          </div>

          <!-- Messages -->
          <div class="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            <div
              v-for="msg in activeConversation.messages"
              :key="msg.id"
              class="flex items-end gap-2"
              :class="msg.isMe ? 'justify-end' : 'justify-start'"
            >
              <div
                v-if="!msg.isMe"
                class="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0"
              >
                <span class="text-[10px] font-semibold text-gray-600">{{ msg.avatar }}</span>
              </div>
              <div
                class="max-w-md px-4 py-3 rounded-2xl shadow-sm"
                :class="
                  msg.isMe
                    ? 'bg-indigo-600 text-white rounded-br-md'
                    : 'bg-white text-gray-700 border border-gray-100 rounded-bl-md'
                "
              >
                <p class="text-sm leading-relaxed">{{ msg.content }}</p>
                <p
                  class="text-[10px] mt-1.5"
                  :class="msg.isMe ? 'text-indigo-200' : 'text-gray-400'"
                >
                  {{ msg.time }}
                </p>
              </div>
            </div>
          </div>

          <!-- Reply Input -->
          <div class="bg-white border-t border-gray-200 p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
            <div class="flex items-end gap-3">
              <div class="flex-1">
                <textarea
                  v-model="replyText"
                  rows="2"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-200 bg-gray-50/50"
                  placeholder="Type your reply..."
                  @keydown.enter.exact.prevent="sendReply"
                />
              </div>
              <div class="flex items-center gap-2 pb-0.5">
                <button
                  class="flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all duration-200 border border-indigo-100"
                  title="AI Quick Reply"
                  @click="aiQuickReply"
                >
                  <SparklesIcon class="w-4 h-4" />
                  <span class="hidden sm:inline">AI Reply</span>
                </button>
                <button
                  class="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-sm shadow-indigo-600/20"
                  :disabled="!replyText.trim()"
                  @click="sendReply"
                >
                  <PaperAirplaneIcon class="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- Empty State -->
        <template v-else>
          <div class="flex-1 flex items-center justify-center">
            <div class="text-center">
              <div class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <InboxIcon class="w-8 h-8 text-gray-400" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-1">Select a conversation</h3>
              <p class="text-sm text-gray-500 max-w-xs">Choose a conversation from the list to start replying</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
