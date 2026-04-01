<template>
  <div>
    <LandingNavbar />

    <SubpageHero
      badge="Analyze"
      title="Track performance across all your channels"
      description="Get actionable insights with comprehensive analytics dashboards and automated reports."
    />

    <FeatureSection
      imagePosition="right"
      bgColor="bg-white"
      title="Channel-wise analytics"
      description="Get unified analytics across all your social media platforms in one place. Track performance metrics that matter and identify what's working."
      :features="[
        { text: 'Facebook, Instagram, LinkedIn & Twitter' },
        { text: 'Engagement rate tracking' },
        { text: 'Follower growth analysis' }
      ]"
    />

    <FeatureSection
      imagePosition="left"
      bgColor="bg-gray-50/50"
      title="Automated reports"
      description="Generate professional, branded reports automatically and deliver them on schedule. Save time and impress stakeholders with data-driven insights."
      :features="[
        { text: 'White-label PDF reports' },
        { text: 'Scheduled report delivery' },
        { text: 'Custom date ranges' }
      ]"
    />

    <FeatureShowcase
      :features="[
        { icon: '📊', title: 'Performance Overview', description: 'Real-time dashboard showing key metrics across all platforms', bgColor: '#DBEAFE' },
        { icon: '🎯', title: 'Competitor Analytics', description: 'Benchmark against competitors and identify market opportunities', bgColor: '#DCFCE7' },
        { icon: '⭐', title: 'Top Content', description: 'Discover your top-performing posts and content strategies', bgColor: '#FEE2E2' },
        { icon: '👥', title: 'Audience Insights', description: 'Deep dive into audience demographics and interests', bgColor: '#FEF3C7' }
      ]"
    />

    <WhatsIncluded
      :items="[
        { icon: '📈', title: 'Cross-platform', description: 'Unified metrics' },
        { icon: '💬', title: 'Engagement', description: 'Track interactions' },
        { icon: '👥', title: 'Demographics', description: 'Audience analysis' },
        { icon: '📝', title: 'Content perf', description: 'Post analytics' },
        { icon: '🎯', title: 'Benchmarking', description: 'Competitor data' },
        { icon: '📄', title: 'Export PDF', description: 'Download reports' },
        { icon: '📅', title: 'Scheduled', description: 'Auto-delivery' },
        { icon: '🎨', title: 'Dashboards', description: 'Custom views' }
      ]"
    />

    <div class="bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h3 class="text-2xl font-bold text-gray-900 mb-8">Trusted by 500+ brands</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p class="text-3xl font-bold text-blue-600">10M+</p>
            <p class="text-gray-600">Posts analyzed</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-blue-600">2B+</p>
            <p class="text-gray-600">Impressions tracked</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-blue-600">95%</p>
            <p class="text-gray-600">Uptime guarantee</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-blue-600">24/7</p>
            <p class="text-gray-600">Support available</p>
          </div>
        </div>
      </div>
    </div>

    <RelatedFeatures
      :features="[
        { title: 'Publish', description: 'Schedule and manage all your posts', link: '/publish', bgColor: '#3B82F6' },
        { title: 'AI Studio', description: 'Generate content with AI', link: '/ai-studio', bgColor: '#10B981' },
        { title: 'Engage', description: 'Manage all conversations', link: '/engage', bgColor: '#F59E0B' }
      ]"
    />

    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Analyze - ContentRich | Track Analytics & Performance',
  meta: [
    { name: 'description', content: 'Get actionable insights with comprehensive analytics dashboards and automated reports. Track performance across all your social media channels.' }
  ]
})

definePageMeta({
  layout: 'landing'
});
</script>
