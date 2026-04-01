<script setup lang="ts">
definePageMeta({
  layout: 'landing',
})

useHead({
  title: 'ContentRich — The Easiest Way to Manage & Grow Your Social Channels',
  meta: [
    { name: 'description', content: 'AI-powered social media management platform for agencies, brands, and marketers. Plan, create and publish content with AI.' },
  ],
})
</script>

<template>
  <div>
    <LandingNavbar />
    <LandingHero />
    <LandingFeatures />
    <LandingTestimonials />
    <LandingSolutions />
    <LandingPricing />
    <LandingCTA />
    <LandingFooter />
  </div>
</template>
