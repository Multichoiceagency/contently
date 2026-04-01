<template>
  <div>
    <LandingNavbar />

    <SubpageHero
      badge="Publish"
      title="Plan, create and publish social posts across all channels"
      description="Save hours every week by managing all your social media accounts from a single, intuitive dashboard."
    />

    <FeatureSection
      imagePosition="right"
      bgColor="bg-white"
      title="Unified content calendar"
      description="Visualize your entire content strategy with our powerful calendar interface. Drag and drop posts to reschedule, collaborate with team members in real-time, and never miss a posting opportunity."
      :features="[
        { text: 'Calendar, list, and feed views' },
        { text: 'Drag-and-drop scheduling' },
        { text: 'Team collaboration in real-time' }
      ]"
    />

    <FeatureSection
      imagePosition="left"
      bgColor="bg-gray-50/50"
      title="Smart post composer"
      description="Create once, publish everywhere. Our intelligent composer adapts your content for each platform while maintaining your brand voice. Get AI-powered suggestions to optimize your posts for maximum engagement."
      :features="[
        { text: 'Platform-specific customization' },
        { text: 'AI-powered caption suggestions' },
        { text: 'Auto first comments & hashtags' }
      ]"
    />

    <FeatureShowcase
      :features="[
        { icon: '📅', title: 'Bulk Scheduling', description: 'Upload and schedule hundreds of posts at once with our batch scheduler. Set it and forget it.', bgColor: '#FEE2E2' },
        { icon: '✓', title: 'Approval Workflows', description: 'Keep your content on brand with multi-level approval workflows before posts go live.', bgColor: '#DBEAFE' },
        { icon: '⏰', title: 'Best Time to Post', description: 'AI analyzes your audience activity to recommend optimal posting times for maximum reach.', bgColor: '#DCFCE7' },
        { icon: '♻', title: 'Evergreen Content', description: 'Set posts to recycle automatically across your best-performing content calendar.', bgColor: '#FEF3C7' }
      ]"
    />

    <WhatsIncluded
      :items="[
        { icon: '📱', title: 'Multi-platform', description: 'Post to all networks' },
        { icon: '👁', title: 'Preview', description: 'See how posts look' },
        { icon: '📋', title: 'Custom queues', description: 'Auto-scheduling rules' },
        { icon: '🖼', title: 'Media library', description: 'Organize your assets' },
        { icon: '🔗', title: 'UTM tracking', description: 'Track campaign links' },
        { icon: '🔄', title: 'RSS automation', description: 'Auto-import feeds' },
        { icon: '♻', title: 'Post recycling', description: 'Repurpose top content' },
        { icon: '👥', title: 'Permissions', description: 'Team access control' }
      ]"
    />

    <div class="bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h3 class="text-2xl font-bold text-gray-900 mb-8">Trusted by 500+ brands</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p class="text-3xl font-bold text-blue-600">50M+</p>
            <p class="text-gray-600">Posts published</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-blue-600">10B+</p>
            <p class="text-gray-600">Impressions generated</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-blue-600">99.9%</p>
            <p class="text-gray-600">Publishing uptime</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-blue-600">5K+</p>
            <p class="text-gray-600">Teams using daily</p>
          </div>
        </div>
      </div>
    </div>

    <RelatedFeatures
      :features="[
        { title: 'AI Studio', description: 'Generate captions, images, and content with AI', link: '/ai-studio', bgColor: '#3B82F6' },
        { title: 'Analyze', description: 'Track analytics and measure what works', link: '/analyze', bgColor: '#10B981' },
        { title: 'Engage', description: 'Manage conversations from one inbox', link: '/engage', bgColor: '#F59E0B' }
      ]"
    />

    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Publish - ContentRich | Plan, Create, and Publish Social Posts',
  meta: [
    { name: 'description', content: 'Manage all your social media accounts from a single, intuitive dashboard. Plan, create, and publish content across all channels.' }
  ]
})

definePageMeta({
  layout: 'landing'
});
</script>
