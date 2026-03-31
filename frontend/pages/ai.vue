<script setup lang="ts">
import {
  SparklesIcon,
  ClockIcon,
} from '@heroicons/vue/24/outline'
import type { Platform, AiTone, AiContentType, AiGeneration } from '~/types'

const router = useRouter()
const { addToast } = useToast()

const loading = ref(false)
const results = ref<string[]>([])
const lastParams = ref<{ platform: string; tone: string } | null>(null)

const history = ref<AiGeneration[]>([
  {
    id: '1',
    topic: 'Product Launch',
    platform: 'linkedin',
    tone: 'professional',
    contentType: 'full-post',
    result: 'Excited to announce our latest innovation...',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    topic: 'Team Culture',
    platform: 'instagram',
    tone: 'casual',
    contentType: 'caption',
    result: 'Behind the scenes at our office...',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '3',
    topic: 'Industry Trends',
    platform: 'twitter',
    tone: 'professional',
    contentType: 'ideas',
    result: '5 trends shaping social media in 2026...',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
])

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

const handleGenerate = async (data: {
  topic: string
  platform: Platform
  tone: AiTone
  contentType: AiContentType
}) => {
  loading.value = true
  results.value = []
  lastParams.value = { platform: data.platform, tone: data.tone }

  // Simulate API delay
  await new Promise(r => setTimeout(r, 1500))

  const typeResults = mockGenerations[data.contentType] || mockGenerations['full-post']
  results.value = typeResults

  // Add to history
  history.value.unshift({
    id: Date.now().toString(),
    topic: data.topic,
    platform: data.platform,
    tone: data.tone,
    contentType: data.contentType,
    result: typeResults[0],
    createdAt: new Date().toISOString(),
  })

  loading.value = false
}

const handleUseInPost = (content: string) => {
  // Navigate to create post with the content pre-filled
  // For now we show a toast
  addToast('Content copied! Create a new post to use it.', 'success')
}
</script>

<template>
  <div>
    <AppTopbar title="AI Generator" subtitle="Create engaging content with AI.">
      <template #action>
        <div class="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-brand-500 to-purple-500 text-white rounded-lg text-sm font-medium">
          <SparklesIcon class="w-4 h-4" />
          AI-Powered
        </div>
      </template>
    </AppTopbar>

    <div class="p-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Generation Form -->
        <div class="lg:col-span-1">
          <AiGenerateForm @generate="handleGenerate" />
        </div>

        <!-- Results -->
        <div class="lg:col-span-2">
          <div v-if="loading" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div class="flex flex-col items-center">
              <div class="relative">
                <LoadingSpinner size="lg" />
                <SparklesIcon class="w-5 h-5 text-brand-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <p class="text-sm text-gray-500 mt-4 font-medium">Generating content...</p>
              <p class="text-xs text-gray-400 mt-1">This usually takes a few seconds</p>
            </div>
          </div>

          <div v-else-if="results.length > 0" class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-gray-900">Generated Content ({{ results.length }} variations)</h3>
            </div>
            <AiResultCard
              v-for="(result, index) in results"
              :key="index"
              :content="result"
              :platform="lastParams?.platform"
              :tone="lastParams?.tone"
              @use-in-post="handleUseInPost"
            />
          </div>

          <div v-else class="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <SparklesIcon class="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 class="text-lg font-semibold text-gray-900 mb-1">Generate content with AI</h3>
            <p class="text-sm text-gray-500 max-w-md mx-auto">
              Enter a topic, select your platform and tone, then let AI create engaging social media content for you.
            </p>
          </div>
        </div>

        <!-- History -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl border border-gray-200">
            <div class="flex items-center gap-2 px-5 py-4 border-b border-gray-200">
              <ClockIcon class="w-5 h-5 text-gray-400" />
              <h3 class="text-sm font-semibold text-gray-900">Recent Generations</h3>
            </div>
            <div class="divide-y divide-gray-100">
              <div
                v-for="item in history"
                :key="item.id"
                class="px-5 py-3 hover:bg-gray-50 cursor-pointer transition-all duration-200"
              >
                <div class="flex items-center gap-2 mb-1">
                  <PlatformIcon :platform="item.platform" size="xs" />
                  <span class="text-xs text-gray-400 capitalize">{{ item.tone }}</span>
                </div>
                <p class="text-xs font-medium text-gray-700 mb-0.5">{{ item.topic }}</p>
                <p class="text-[10px] text-gray-400">
                  {{ new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
