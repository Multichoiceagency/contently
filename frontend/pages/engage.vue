<template>
  <div>
    <LandingNavbar />

    <SubpageHero
      badge="Engage"
      title="Never miss a DM or comment again"
      description="Manage all your social conversations from one unified inbox. Reply faster, collaborate better."
    />

    <FeatureSection
      imagePosition="right"
      bgColor="bg-white"
      title="Unified social inbox"
      description="Consolidate all your direct messages and comments from every social platform into a single, organized inbox. Streamline your response workflow and never miss important conversations."
      :features="[
        { text: 'All DMs and comments in one place' },
        { text: 'Real-time notifications' },
        { text: 'Conversation assignment' }
      ]"
    />

    <FeatureSection
      imagePosition="left"
      bgColor="bg-gray-50/50"
      title="Team collaboration"
      description="Work seamlessly with your team on social responses. Add internal notes, tag conversations, and use saved reply templates to maintain consistency and speed."
      :features="[
        { text: 'Internal notes and tags' },
        { text: 'Collision detection' },
        { text: 'Saved reply templates' }
      ]"
    />

    <FeatureShowcase
      :features="[
        { icon: '🤖', title: 'Smart Assignment', description: 'Automatically route conversations to the right team members', bgColor: '#DBEAFE' },
        { icon: '💾', title: 'Saved Replies', description: 'Build a library of pre-written responses for common questions', bgColor: '#DCFCE7' },
        { icon: '🏷', title: 'Conversation Tags', description: 'Organize and categorize conversations for better management', bgColor: '#FEE2E2' },
        { icon: '📋', title: 'Activity Logs', description: 'Track all interactions and responses for compliance and analysis', bgColor: '#FEF3C7' }
      ]"
    />

    <WhatsIncluded
      :items="[
        { icon: '📬', title: 'Multi-inbox', description: 'All platforms in one' },
        { icon: '💬', title: 'Comments', description: 'Reply management' },
        { icon: '💌', title: 'DM handling', description: 'Message responses' },
        { icon: '📝', title: 'Team notes', description: 'Internal notes' },
        { icon: '🤖', title: 'Auto-assign', description: 'Smart routing' },
        { icon: '😊', title: 'Sentiment', description: 'Emotion detection' },
        { icon: '📄', title: 'Templates', description: 'Pre-written replies' },
        { icon: '📊', title: 'Metrics', description: 'Response times' }
      ]"
    />

    <div class="bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h3 class="text-2xl font-bold text-gray-900 mb-8">Trusted by 500+ brands</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p class="text-3xl font-bold text-blue-600">50M+</p>
            <p class="text-gray-600">Messages handled</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-blue-600">2H</p>
            <p class="text-gray-600">Avg response time</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-blue-600">99%</p>
            <p class="text-gray-600">Satisfaction rate</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-blue-600">15+</p>
            <p class="text-gray-600">Team members</p>
          </div>
        </div>
      </div>
    </div>

    <RelatedFeatures
      :features="[
        { title: 'Publish', description: 'Schedule and manage all your posts', link: '/publish', bgColor: '#3B82F6' },
        { title: 'AI Studio', description: 'Generate content with AI', link: '/ai-studio', bgColor: '#10B981' },
        { title: 'Discover', description: 'Find trending content', link: '/discover', bgColor: '#F59E0B' }
      ]"
    />

    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Engage - ContentRich | Manage Social Conversations',
  meta: [
    { name: 'description', content: 'Manage all your social conversations from one unified inbox. Reply faster, collaborate better with your team on DMs and comments.' }
  ]
})

definePageMeta({
  layout: 'landing'
});
</script>
