<template>
  <section class="w-full bg-white py-20 md:py-32">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-12 md:mb-16 text-center">
        <div class="mb-4 inline-block">
          <span class="text-sm font-semibold text-cs-blue">All-in-one platform</span>
        </div>
        <h2 class="mb-6 text-3xl md:text-4xl font-semibold text-cs-heading">
          Everything you need to dominate social media
        </h2>
        <p class="mx-auto max-w-2xl text-center text-cs-muted">
          Streamline your social media management with our comprehensive suite of tools designed to accelerate growth and drive engagement across all platforms.
        </p>
      </div>

      <!-- Tab Navigation -->
      <div class="mb-12 flex justify-center border-b border-gray-200">
        <nav class="flex space-x-8" aria-label="Feature tabs">
          <button
            v-for="(tab, index) in tabs"
            :key="index"
            @click="activeTab = index"
            :class="[
              'flex items-center gap-2 px-2 py-4 text-sm font-medium transition-colors duration-200',
              activeTab === index
                ? 'border-b-2 border-cs-blue text-cs-blue'
                : 'border-b-2 border-transparent text-gray-600 hover:text-gray-900'
            ]"
          >
            <component :is="tab.icon" class="h-5 w-5" />
            <span>{{ tab.name }}</span>
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2 items-center">
        <!-- Left Side: Text Content -->
        <transition name="fade" mode="out-in">
          <div :key="activeTab" class="space-y-6">
            <h3 class="text-2xl font-semibold text-cs-heading">
              {{ currentTab.heading }}
            </h3>

            <p class="text-base text-cs-muted leading-relaxed">
              {{ currentTab.description }}
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-wrap items-center gap-4 pt-4">
              <button class="rounded-full bg-cs-blue px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-cs-blue-dark active:scale-95">
                Start free trial
              </button>
              <button class="font-medium text-cs-blue transition-colors duration-200 hover:text-cs-blue-dark">
                Learn more →
              </button>
            </div>

            <!-- Feature Bullets -->
            <div class="space-y-3 pt-6">
              <div
                v-for="(feature, idx) in currentTab.features"
                :key="idx"
                class="flex items-start gap-3"
              >
                <div class="mt-1 flex-shrink-0">
                  <component
                    :is="feature.icon"
                    class="h-5 w-5 text-cs-blue"
                  />
                </div>
                <span class="text-sm text-cs-muted">{{ feature.text }}</span>
              </div>
            </div>
          </div>
        </transition>

        <!-- Right Side: Mockup Card -->
        <transition name="fade" mode="out-in">
          <div :key="activeTab" class="hidden lg:block">
            <div
              :class="[
                'rounded-2xl p-8 shadow-lg transition-all duration-300',
                currentTab.cardBg
              ]"
            >
              <!-- Mockup placeholder content -->
              <div class="space-y-4">
                <!-- Header bar -->
                <div class="flex items-center gap-2">
                  <div class="h-3 w-3 rounded-full bg-white opacity-40"></div>
                  <div class="h-3 w-3 rounded-full bg-white opacity-40"></div>
                  <div class="h-3 w-3 rounded-full bg-white opacity-40"></div>
                </div>

                <!-- Content placeholder boxes -->
                <div class="space-y-3 pt-4">
                  <div class="h-8 rounded bg-white opacity-20"></div>
                  <div class="h-4 rounded bg-white opacity-15 w-3/4"></div>
                  <div class="h-4 rounded bg-white opacity-15 w-2/3"></div>
                </div>

                <!-- Visual elements -->
                <div class="grid grid-cols-2 gap-3 pt-6">
                  <div class="h-24 rounded-lg bg-white opacity-10"></div>
                  <div class="h-24 rounded-lg bg-white opacity-10"></div>
                </div>

                <div class="h-12 rounded bg-white opacity-10 mt-4"></div>

                <!-- Stats bar -->
                <div class="grid grid-cols-3 gap-2 pt-6">
                  <div class="rounded bg-white opacity-15 p-2 text-center">
                    <div class="text-xs font-semibold text-white opacity-70">+45%</div>
                  </div>
                  <div class="rounded bg-white opacity-15 p-2 text-center">
                    <div class="text-xs font-semibold text-white opacity-70">2.3K</div>
                  </div>
                  <div class="rounded bg-white opacity-15 p-2 text-center">
                    <div class="text-xs font-semibold text-white opacity-70">94%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  SparklesIcon,
  CalendarIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

interface Tab {
  name: string
  icon: any
}

interface Feature {
  text: string
  icon: any
}

interface TabContent {
  heading: string
  description: string
  features: Feature[]
  cardBg: string
}

const activeTab = ref(0)

const tabs: Tab[] = [
  { name: 'AI Studio', icon: SparklesIcon },
  { name: 'Publish', icon: CalendarIcon },
  { name: 'Analyze', icon: ChartBarIcon },
  { name: 'Engage', icon: ChatBubbleLeftRightIcon },
  { name: 'Discover', icon: MagnifyingGlassIcon }
]

const tabsContent: TabContent[] = [
  {
    heading: 'Accelerate your content creation with our AI powerpack',
    description:
      'Harness the power of artificial intelligence to generate compelling captions, trending hashtags, and stunning visuals. Save hours of creative work and maintain consistency across all your channels.',
    features: [
      { text: 'AI-powered caption generation', icon: CheckIcon },
      { text: 'Hashtag and trend recommendations', icon: CheckIcon },
      { text: 'AI image creation and enhancement', icon: CheckIcon }
    ],
    cardBg: 'bg-gradient-to-br from-blue-100 to-blue-50'
  },
  {
    heading: 'Plan and schedule your content with a unified calendar',
    description:
      'Coordinate all your social media campaigns in one intuitive calendar view. Schedule posts across multiple platforms, manage your content pipeline, and optimize posting times for maximum engagement.',
    features: [
      { text: 'Unified content calendar', icon: CheckIcon },
      { text: 'Bulk scheduling and rescheduling', icon: CheckIcon },
      { text: 'Optimal posting time suggestions', icon: CheckIcon }
    ],
    cardBg: 'bg-gradient-to-br from-green-100 to-green-50'
  },
  {
    heading: 'Track performance across all your channels',
    description:
      'Gain deep insights into your social media performance with comprehensive analytics dashboards. Monitor competitor activity, track growth metrics, and identify opportunities to optimize your strategy.',
    features: [
      { text: 'Multi-channel analytics dashboards', icon: CheckIcon },
      { text: 'Competitor tracking and benchmarking', icon: CheckIcon },
      { text: 'Custom performance reports', icon: CheckIcon }
    ],
    cardBg: 'bg-gradient-to-br from-purple-100 to-purple-50'
  },
  {
    heading: 'Never miss a DM or comment again',
    description:
      'Consolidate all your conversations into a unified inbox. Collaborate with your team, assign comments and messages, and respond faster with intelligent suggestions and templates.',
    features: [
      { text: 'Unified multi-channel inbox', icon: CheckIcon },
      { text: 'Team collaboration and assignments', icon: CheckIcon },
      { text: 'Smart response templates', icon: CheckIcon }
    ],
    cardBg: 'bg-gradient-to-br from-pink-100 to-pink-50'
  },
  {
    heading: 'Find trending content in your niche',
    description:
      'Discover high-performing content and emerging trends relevant to your industry. Aggregate content from RSS feeds and social sources to stay ahead of the curve and inspire your own content strategy.',
    features: [
      { text: 'Trend discovery and monitoring', icon: CheckIcon },
      { text: 'RSS feed aggregation', icon: CheckIcon },
      { text: 'Content inspiration library', icon: CheckIcon }
    ],
    cardBg: 'bg-gradient-to-br from-orange-100 to-orange-50'
  }
]

const currentTab = computed(() => tabsContent[activeTab.value])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
