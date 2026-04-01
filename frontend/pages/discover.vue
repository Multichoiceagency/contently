<template>
  <div>
    <LandingNavbar />

    <SubpageHero
      badge="Discover"
      title="Find trending content in your niche"
      description="Stay ahead of the curve with curated content feeds, trending topics, and RSS management."
    />

    <FeatureSection
      imagePosition="right"
      bgColor="bg-white"
      title="Topic feeds"
      description="Discover trending content and hot topics in your industry. Create custom feeds based on keywords and interests, then bookmark and share content that resonates with your audience."
      :features="[
        { text: 'Trending content by topic' },
        { text: 'Custom feed creation' },
        { text: 'Bookmark and share' }
      ]"
    />

    <FeatureSection
      imagePosition="left"
      bgColor="bg-gray-50/50"
      title="RSS feed management"
      description="Consolidate content from unlimited RSS feeds into a single dashboard. Automatically publish feed content to your social channels with intelligent filtering and scheduling."
      :features="[
        { text: 'Import unlimited RSS feeds' },
        { text: 'Auto-publish from feeds' },
        { text: 'Content filtering' }
      ]"
    />

    <FeatureShowcase
      :features="[
        { icon: '🔥', title: 'Trending Topics', description: 'Real-time trending content discovery across your industry', bgColor: '#DBEAFE' },
        { icon: '🎯', title: 'Content Curation', description: 'AI-powered recommendations based on your interests and audience', bgColor: '#DCFCE7' },
        { icon: '📡', title: 'RSS Feeds', description: 'Manage and monitor multiple RSS sources in one place', bgColor: '#FEE2E2' },
        { icon: '⭐', title: 'Influencer Discovery', description: 'Find key influencers and voices in your niche', bgColor: '#FEF3C7' }
      ]"
    />

    <WhatsIncluded
      :items="[
        { icon: '🔍', title: 'Discovery', description: 'Find trending topics' },
        { icon: '📡', title: 'RSS mgmt', description: 'Feed management' },
        { icon: '🔖', title: 'Bookmarks', description: 'Save content' },
        { icon: '📤', title: 'Bulk share', description: 'Share at scale' },
        { icon: '🔗', title: 'Filtering', description: 'Smart filters' },
        { icon: '🔔', title: 'Keyword alerts', description: 'Notifications' },
        { icon: '📚', title: 'Sources', description: 'Source control' },
        { icon: '📅', title: 'Calendar', description: 'Integration' }
      ]"
    />

    <div class="bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h3 class="text-2xl font-bold text-gray-900 mb-8">Trusted by 500+ brands</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p class="text-3xl font-bold text-blue-600">100K+</p>
            <p class="text-gray-600">Content sources</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-blue-600">1M+</p>
            <p class="text-gray-600">Articles daily</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-blue-600">50+</p>
            <p class="text-gray-600">Industries covered</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-blue-600">30 min</p>
            <p class="text-gray-600">Time saved daily</p>
          </div>
        </div>
      </div>
    </div>

    <RelatedFeatures
      :features="[
        { title: 'Publish', description: 'Schedule and manage all your posts', link: '/publish', bgColor: '#3B82F6' },
        { title: 'AI Studio', description: 'Generate content with AI', link: '/ai-studio', bgColor: '#10B981' },
        { title: 'Analyze', description: 'Track analytics & insights', link: '/analyze', bgColor: '#F59E0B' }
      ]"
    />

    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Discover - ContentRich | Find Trending Content',
  meta: [
    { name: 'description', content: 'Stay ahead of the curve with curated content feeds, trending topics, and RSS management. Discover content in your niche automatically.' }
  ]
})

definePageMeta({
  layout: 'landing'
});
</script>
