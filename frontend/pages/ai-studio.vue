<template>
  <div>
    <LandingNavbar />

    <SubpageHero
      badge="AI Studio"
      title="Create scroll-stopping content with AI"
      description="Generate captions, images, hashtags and more. Let AI handle the creative heavy lifting."
    />

    <FeatureSection
      imagePosition="right"
      bgColor="bg-white"
      title="AI writing assistant"
      description="Generate engaging captions and compelling post copy in seconds. Our AI understands your brand voice and creates content that resonates with your audience across all platforms."
      :features="[
        { text: 'One-click caption generation' },
        { text: 'Brand voice customization' },
        { text: 'Multi-language support' }
      ]"
    />

    <FeatureSection
      imagePosition="left"
      bgColor="bg-gray-50/50"
      title="AI image generation"
      description="Create stunning, unique visuals without hiring a designer. Generate multiple image variations, explore different styles and moods, and refresh your content library instantly."
      :features="[
        { text: 'Text-to-image generation' },
        { text: 'Style and mood selection' },
        { text: 'Batch image creation' }
      ]"
    />

    <FeatureShowcase
      :features="[
        { icon: '✍️', title: 'Caption Generator', description: 'Transform your content ideas into engaging captions optimized for each platform and audience segment.', bgColor: '#DBEAFE' },
        { icon: '#️⃣', title: 'Hashtag Generator', description: 'Get data-driven hashtag recommendations to increase discoverability and reach your target audience.', bgColor: '#DCFCE7' },
        { icon: '🎨', title: 'Image Generator', description: 'Create original, royalty-free images from text descriptions without leaving your content dashboard.', bgColor: '#FEE2E2' },
        { icon: '💡', title: 'Content Ideas', description: 'Get AI-generated content suggestions based on trends, your history, and audience interests.', bgColor: '#FEF3C7' }
      ]"
    />

    <WhatsIncluded
      :items="[
        { icon: '⚡', title: 'Quick prompts', description: 'Ready-to-use templates' },
        { icon: '📝', title: 'Saved templates', description: 'Reuse your favorites' },
        { icon: '🎙', title: 'Brand voice', description: 'Custom tone & style' },
        { icon: '🖌️', title: 'Image editing', description: 'Built-in tools' },
        { icon: '#️⃣', title: 'Hashtag sugg.', description: 'Data-driven tags' },
        { icon: '♻', title: 'Repurposing', description: 'Adapt for platforms' },
        { icon: '🧪', title: 'A/B testing', description: 'Test variations' },
        { icon: '📤', title: 'Multi-export', description: 'All formats' }
      ]"
    />

    <div class="bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h3 class="text-2xl font-bold text-gray-900 mb-8">Trusted by 500+ brands</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p class="text-3xl font-bold text-blue-600">100M+</p>
            <p class="text-gray-600">Posts generated</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-blue-600">1B+</p>
            <p class="text-gray-600">Images created</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-blue-600">8x</p>
            <p class="text-gray-600">Faster content creation</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-blue-600">92%</p>
            <p class="text-gray-600">Higher engagement rate</p>
          </div>
        </div>
      </div>
    </div>

    <RelatedFeatures
      :features="[
        { title: 'Publish', description: 'Schedule and manage all your posts', link: '/publish', bgColor: '#3B82F6' },
        { title: 'Analyze', description: 'Track performance metrics & insights', link: '/analyze', bgColor: '#10B981' },
        { title: 'Discover', description: 'Find trending content in your niche', link: '/discover', bgColor: '#F59E0B' }
      ]"
    />

    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'AI Studio - ContentRich | Create Content with AI',
  meta: [
    { name: 'description', content: 'Generate captions, images, hashtags and more with AI. Create scroll-stopping content in seconds with our advanced AI writing and image generation tools.' }
  ]
})

definePageMeta({
  layout: 'landing'
});
</script>
