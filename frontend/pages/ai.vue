<script setup lang="ts">
import {
  SparklesIcon,
  ClockIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BoltIcon,
} from '@heroicons/vue/24/outline'
import type { Platform, AiTone, AiContentType, AiGeneration } from '~/types'

const router = useRouter()
const { addToast } = useToast()
const { token } = useAuth()
const { current } = useWorkspace()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

const loading = ref(false)
const results = ref<string[]>([])
const lastParams = ref<{ platform: string; tone: string } | null>(null)
const historyOpen = ref(true)
const creditsUsed = ref(847)
const creditsTotal = ref(1000)

// Form state with floating labels
const topic = ref('')
const topicFocused = ref(false)
const selectedPlatform = ref<Platform>('linkedin')
const selectedTone = ref<AiTone>('professional')
const selectedContentType = ref<AiContentType>('full-post')

const tones: { id: AiTone; label: string; emoji: string; description: string }[] = [
  { id: 'professional', label: 'Professional', emoji: '\uD83D\uDC54', description: 'Corporate & polished' },
  { id: 'casual', label: 'Casual', emoji: '\u2615', description: 'Friendly & relaxed' },
  { id: 'fun', label: 'Fun', emoji: '\uD83C\uDF89', description: 'Playful & energetic' },
  { id: 'inspiring', label: 'Inspiring', emoji: '\uD83D\uDE80', description: 'Motivating & bold' },
]

const platforms: { id: Platform; label: string }[] = [
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'twitter', label: 'Twitter/X' },
  { id: 'instagram', label: 'Instagram' },
]

const contentTypes: { id: AiContentType; label: string }[] = [
  { id: 'full-post', label: 'Full Post' },
  { id: 'caption', label: 'Caption' },
  { id: 'hashtags', label: 'Hashtags' },
  { id: 'ideas', label: 'Content Ideas' },
]

const history = ref<AiGeneration[]>([])

const loadHistory = async () => {
  if (!token.value || !current.value?.id) return
  try {
    const res = await $fetch<any>(`${apiBase}/ai/history`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        'x-workspace-id': current.value.id,
      },
    })
    history.value = (res.generations || []).map((g: any) => ({
      id: g.id,
      topic: g.prompt,
      platform: 'linkedin' as Platform,
      tone: 'professional' as AiTone,
      contentType: g.type as AiContentType,
      result: g.result,
      createdAt: g.createdAt,
    }))
  } catch {
    history.value = []
  }
}

onMounted(() => loadHistory())

const mockGenerations: Record<string, string[]> = {
  'full-post': [
    `We're thrilled to share something we've been working on for months. Our team has been laser-focused on building a solution that truly addresses your pain points.\n\nHere's what makes this different:\n- Built with AI at its core\n- Designed for real workflows\n- Seamless platform integration\n\nThe future of social media management is here. Are you ready?\n\n#Innovation #SocialMedia #AI`,
    `Did you know that 73% of marketers say social media has been "very effective" for their business? Yet most still spend hours manually scheduling posts.\n\nThat's why we built Flowgent -- to give you those hours back.\n\nOur AI doesn't just schedule posts. It:\n1. Analyzes your audience behavior\n2. Suggests optimal posting times\n3. Generates engaging content\n4. Tracks performance in real-time\n\nStart your free trial today.`,
    `Great content isn't about posting more. It's about posting smarter.\n\nWe analyzed 100,000+ social media posts and found that:\n- Posts with questions get 2x more engagement\n- Visual content performs 3x better than text-only\n- Consistency beats frequency every time\n\nWhat's your biggest social media challenge? Drop it in the comments.`,
  ],
  'caption': [
    'Building the future of social media, one post at a time. Your content deserves to be seen.',
    'Less scheduling. More creating. Let AI handle the rest.',
    'When your content strategy runs on autopilot, you focus on what matters -- connecting with your audience.',
  ],
  'hashtags': [
    '#SocialMediaMarketing #ContentStrategy #AITools #MarketingAutomation #DigitalMarketing #SocialMediaManager #ContentCreation #GrowthHacking #BrandBuilding #MarketingTips',
    '#ContentIsKing #SocialMediaTips #AIContent #MarketingStrategy #EngagementBoost #SocialGrowth #BrandVoice #ContentPlanning #SocialAnalytics #SmartMarketing',
    '#DigitalStrategy #SocialFirst #AutomationTools #ContentMarketing #BrandPresence #SocialROI #MarketingGoals #AIPowered #ContentCalendar #SocialSelling',
  ],
  'ideas': [
    '1. Share a behind-the-scenes look at your team\n2. Create a "Day in the Life" post series\n3. Run a poll asking about industry preferences\n4. Share a customer success story\n5. Post a tip or hack related to your product\n6. Create an infographic with industry stats\n7. Host a live Q&A session\n8. Share your company\'s origin story\n9. Create a "myth vs reality" post\n10. Celebrate a team or company milestone',
    '1. Interview a team member spotlight\n2. Share a "before and after" transformation\n3. Post user-generated content\n4. Create a countdown to a product launch\n5. Share a relevant industry report or study\n6. Post a carousel with actionable tips\n7. Create a challenge for your followers\n8. Share a quote from your CEO\n9. Post a "This or That" interactive story\n10. Create a weekly series theme',
    '1. Repurpose a blog post into social snippets\n2. Share a tool recommendation list\n3. Create a "How we built X" thread\n4. Post a comparison with competitors\n5. Share real metrics and results\n6. Create educational micro-content\n7. Post a team celebration moment\n8. Share customer feedback highlights\n9. Create a prediction post about industry trends\n10. Post a motivational Monday series',
  ],
}

// Group history by date
const groupedHistory = computed(() => {
  const groups: { label: string; items: AiGeneration[] }[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const todayItems: AiGeneration[] = []
  const yesterdayItems: AiGeneration[] = []
  const olderItems: AiGeneration[] = []

  history.value.forEach(item => {
    const d = new Date(item.createdAt)
    d.setHours(0, 0, 0, 0)
    if (d.getTime() === today.getTime()) todayItems.push(item)
    else if (d.getTime() === yesterday.getTime()) yesterdayItems.push(item)
    else olderItems.push(item)
  })

  if (todayItems.length) groups.push({ label: 'Today', items: todayItems })
  if (yesterdayItems.length) groups.push({ label: 'Yesterday', items: yesterdayItems })
  if (olderItems.length) groups.push({ label: 'Earlier', items: olderItems })
  return groups
})

const creditPercent = computed(() => Math.round((creditsUsed.value / creditsTotal.value) * 100))

const handleGenerate = async () => {
  if (!topic.value.trim() || !token.value || !current.value?.id) return
  loading.value = true
  results.value = []
  lastParams.value = { platform: selectedPlatform.value, tone: selectedTone.value }

  try {
    const res = await $fetch<any>(`${apiBase}/ai/generate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
        'x-workspace-id': current.value.id,
      },
      body: {
        type: selectedContentType.value,
        topic: topic.value,
        platform: selectedPlatform.value,
        tone: selectedTone.value,
      },
    })

    results.value = [res.result || res.content || '']
    creditsUsed.value = Math.min(creditsUsed.value + (res.tokens || 1), creditsTotal.value)

    history.value.unshift({
      id: Date.now().toString(),
      topic: topic.value,
      platform: selectedPlatform.value,
      tone: selectedTone.value,
      contentType: selectedContentType.value,
      result: results.value[0],
      createdAt: new Date().toISOString(),
    })
  } catch (error: any) {
    const msg = error?.data?.message || 'AI generation failed. Check your OpenAI API key.'
    addToast(msg, 'error')
  } finally {
    loading.value = false
  }
}

const handleRegenerate = async () => {
  await handleGenerate()
}

const handleUseInPost = (content: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(content)
  }
  addToast('Content copied to clipboard! Create a new post to use it.', 'success')
}

// Thinking dots animation
const thinkingDots = ref(0)
let thinkingInterval: ReturnType<typeof setInterval> | null = null

watch(loading, (val) => {
  if (val) {
    thinkingDots.value = 0
    thinkingInterval = setInterval(() => {
      thinkingDots.value = (thinkingDots.value + 1) % 4
    }, 400)
  } else {
    if (thinkingInterval) clearInterval(thinkingInterval)
  }
})

// Result fade-in stagger
const visibleResults = ref<number[]>([])
watch(results, (val) => {
  visibleResults.value = []
  if (val.length) {
    val.forEach((_, i) => {
      setTimeout(() => {
        visibleResults.value.push(i)
      }, i * 200)
    })
  }
})
</script>

<template>
  <div>
    <AppTopbar title="AI Generator" subtitle="Create engaging content with AI.">
      <template #action>
        <!-- Credit/Token Usage Indicator -->
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg">
            <BoltIcon class="w-4 h-4 text-amber-500" />
            <div class="flex items-center gap-2">
              <div class="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="creditPercent > 80 ? 'bg-red-500' : creditPercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'"
                  :style="{ width: `${creditPercent}%` }"
                />
              </div>
              <span class="text-xs font-medium text-gray-600">{{ creditsUsed }}/{{ creditsTotal }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm font-medium shadow-sm">
            <SparklesIcon class="w-4 h-4" />
            AI-Powered
          </div>
        </div>
      </template>
    </AppTopbar>

    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mx-6 mt-6 rounded-2xl">
      <div class="absolute inset-0 overflow-hidden">
        <!-- Sparkles animation -->
        <div class="sparkle sparkle-1"></div>
        <div class="sparkle sparkle-2"></div>
        <div class="sparkle sparkle-3"></div>
        <div class="sparkle sparkle-4"></div>
        <div class="sparkle sparkle-5"></div>
        <div class="sparkle sparkle-6"></div>
      </div>
      <div class="relative px-8 py-10 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-white/90 text-xs font-medium mb-4">
          <SparklesIcon class="w-3.5 h-3.5" />
          Powered by Advanced AI
        </div>
        <h2 class="text-3xl font-bold text-white mb-2">AI-Powered Content</h2>
        <p class="text-white/80 max-w-lg mx-auto text-sm leading-relaxed">
          Generate scroll-stopping social media content in seconds. Choose your platform, set your tone, and let AI do the heavy lifting.
        </p>
      </div>
    </div>

    <div class="p-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Generation Form -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Generate Content</h3>

            <div class="space-y-5">
              <!-- Topic with floating label -->
              <div class="relative">
                <input
                  v-model="topic"
                  type="text"
                  id="ai-topic"
                  class="peer w-full px-4 pt-5 pb-2 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all duration-300"
                  placeholder="Topic"
                  @focus="topicFocused = true"
                  @blur="topicFocused = false"
                />
                <label
                  for="ai-topic"
                  class="absolute left-4 transition-all duration-200 pointer-events-none"
                  :class="topic || topicFocused
                    ? 'top-1.5 text-[10px] font-semibold text-indigo-500'
                    : 'top-3.5 text-sm text-gray-400'"
                >
                  Topic or Product
                </label>
              </div>

              <!-- Platform -->
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Platform</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="p in platforms"
                    :key="p.id"
                    class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-200"
                    :class="
                      selectedPlatform === p.id
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    "
                    @click="selectedPlatform = p.id"
                  >
                    <PlatformIcon :platform="p.id" size="xs" />
                    {{ p.label }}
                  </button>
                </div>
              </div>

              <!-- Tone as visual cards -->
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tone</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="t in tones"
                    :key="t.id"
                    class="flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200 group"
                    :class="
                      selectedTone === t.id
                        ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    "
                    @click="selectedTone = t.id"
                  >
                    <span class="text-xl">{{ t.emoji }}</span>
                    <span
                      class="text-xs font-semibold"
                      :class="selectedTone === t.id ? 'text-indigo-700' : 'text-gray-700'"
                    >{{ t.label }}</span>
                    <span
                      class="text-[10px]"
                      :class="selectedTone === t.id ? 'text-indigo-500' : 'text-gray-400'"
                    >{{ t.description }}</span>
                  </button>
                </div>
              </div>

              <!-- Content Type -->
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Content Type</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="ct in contentTypes"
                    :key="ct.id"
                    class="px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-200"
                    :class="
                      selectedContentType === ct.id
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
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
                class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl text-sm font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
                :disabled="!topic.trim() || loading"
                @click="handleGenerate"
              >
                <LoadingSpinner v-if="loading" size="sm" />
                <template v-else>
                  <SparklesIcon class="w-5 h-5" />
                  Generate Content
                </template>
              </button>
            </div>
          </div>
        </div>

        <!-- Results -->
        <div class="lg:col-span-2">
          <!-- Loading State: AI Thinking Animation -->
          <div v-if="loading" class="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
            <div class="flex flex-col items-center">
              <!-- AI Thinking Animation -->
              <div class="relative mb-6">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse">
                  <SparklesIcon class="w-8 h-8 text-white" />
                </div>
                <div class="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full animate-ping" />
              </div>

              <!-- Thinking Dots with Gradient Shimmer -->
              <div class="flex items-center gap-1 mb-4">
                <span class="text-sm font-medium text-gray-700">AI is thinking</span>
                <div class="flex gap-0.5">
                  <span
                    v-for="i in 3"
                    :key="i"
                    class="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    :class="thinkingDots >= i ? 'bg-indigo-500 scale-110' : 'bg-gray-300 scale-100'"
                  />
                </div>
              </div>

              <!-- Shimmer Lines -->
              <div class="w-full max-w-sm space-y-3">
                <div class="h-3 rounded-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 shimmer-line" />
                <div class="h-3 rounded-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 shimmer-line" style="animation-delay: 0.2s; width: 80%" />
                <div class="h-3 rounded-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 shimmer-line" style="animation-delay: 0.4s; width: 60%" />
              </div>

              <p class="text-xs text-gray-400 mt-4">Crafting compelling content for {{ selectedPlatform }}...</p>
            </div>
          </div>

          <!-- Results -->
          <div v-else-if="results.length > 0" class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-gray-900">
                Generated Content
                <span class="text-gray-400 font-normal ml-1">({{ results.length }} variations)</span>
              </h3>
              <button
                class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all duration-200"
                @click="handleRegenerate"
              >
                <ArrowPathIcon class="w-4 h-4" />
                Regenerate
              </button>
            </div>

            <!-- Staggered Fade-in Result Cards -->
            <div
              v-for="(result, index) in results"
              :key="index"
              class="transition-all duration-500"
              :class="visibleResults.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            >
              <AiResultCard
                :content="result"
                :platform="lastParams?.platform"
                :tone="lastParams?.tone"
                @use-in-post="handleUseInPost"
              />
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center mx-auto mb-4">
              <SparklesIcon class="w-8 h-8 text-indigo-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-1">Generate content with AI</h3>
            <p class="text-sm text-gray-500 max-w-md mx-auto">
              Enter a topic, select your platform and tone, then let AI create engaging social media content for you.
            </p>
          </div>
        </div>

        <!-- History Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
            <!-- Collapsible Header -->
            <button
              class="w-full flex items-center justify-between px-5 py-4 border-b border-gray-100 hover:bg-gray-50/50 transition-all duration-200"
              @click="historyOpen = !historyOpen"
            >
              <div class="flex items-center gap-2">
                <ClockIcon class="w-5 h-5 text-gray-400" />
                <h3 class="text-sm font-semibold text-gray-900">Recent Generations</h3>
                <span class="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{{ history.length }}</span>
              </div>
              <component
                :is="historyOpen ? ChevronUpIcon : ChevronDownIcon"
                class="w-4 h-4 text-gray-400 transition-transform duration-200"
              />
            </button>

            <!-- Collapsible Body with Date Groupings -->
            <div
              class="overflow-hidden transition-all duration-300"
              :style="{ maxHeight: historyOpen ? '600px' : '0px' }"
            >
              <div class="overflow-y-auto max-h-[560px]">
                <template v-for="group in groupedHistory" :key="group.label">
                  <div class="px-5 pt-3 pb-1">
                    <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{{ group.label }}</span>
                  </div>
                  <div
                    v-for="item in group.items"
                    :key="item.id"
                    class="px-5 py-3 hover:bg-gray-50 cursor-pointer transition-all duration-200 border-l-2 border-transparent hover:border-indigo-400"
                  >
                    <div class="flex items-center gap-2 mb-1">
                      <PlatformIcon :platform="item.platform" size="xs" />
                      <span class="text-[10px] text-gray-400 capitalize bg-gray-100 px-1.5 py-0.5 rounded">{{ item.tone }}</span>
                      <span class="text-[10px] text-gray-300 capitalize">{{ item.contentType }}</span>
                    </div>
                    <p class="text-xs font-medium text-gray-700 mb-0.5 truncate">{{ item.topic }}</p>
                    <p class="text-[10px] text-gray-400 truncate">{{ item.result }}</p>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Sparkle animations */
.sparkle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  opacity: 0;
  animation: sparkle-float 3s ease-in-out infinite;
}

.sparkle-1 { top: 20%; left: 10%; animation-delay: 0s; }
.sparkle-2 { top: 60%; left: 25%; animation-delay: 0.5s; }
.sparkle-3 { top: 30%; left: 70%; animation-delay: 1s; }
.sparkle-4 { top: 70%; left: 80%; animation-delay: 1.5s; }
.sparkle-5 { top: 15%; left: 50%; animation-delay: 2s; }
.sparkle-6 { top: 80%; left: 40%; animation-delay: 2.5s; }

@keyframes sparkle-float {
  0%, 100% {
    opacity: 0;
    transform: translateY(0) scale(0);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-20px) scale(1);
  }
}

/* Shimmer animation for loading lines */
.shimmer-line {
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
