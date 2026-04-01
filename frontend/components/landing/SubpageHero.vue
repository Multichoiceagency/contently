<template>
  <section class="relative bg-gradient-to-b from-white to-bg-cs-blue-light py-16 md:py-24">
    <!-- Badge -->
    <div v-if="badge" class="flex justify-center mb-6">
      <span class="inline-block px-4 py-2 rounded-full bg-blue-50 text-text-cs-blue text-sm font-semibold">
        {{ badge }}
      </span>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <!-- Heading -->
      <h1 class="text-5xl md:text-6xl font-bold text-text-cs-heading mb-6 leading-tight">
        {{ title }}
      </h1>

      <!-- Description -->
      <p class="text-xl text-text-cs-muted max-w-2xl mx-auto mb-10">
        {{ description }}
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <button class="px-8 py-3 bg-cs-blue text-white rounded-full font-semibold hover:bg-cs-blue-dark transition-colors duration-200">
          Start your free trial
        </button>
        <button class="px-8 py-3 border border-gray-200 text-text-cs-body rounded-full font-semibold bg-white hover:shadow-md transition-all duration-200">
          Book a demo
        </button>
      </div>

      <!-- Trial Info -->
      <p class="text-sm text-text-cs-muted mb-12">
        14-day free trial · No credit card required.
      </p>

      <!-- Social Platforms -->
      <div v-if="showPlatforms" class="flex justify-center gap-6 flex-wrap">
        <div class="flex items-center gap-2">
          <span class="text-2xl">Slack</span>
          <span class="text-text-cs-muted text-sm">Slack</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-2xl">Notion</span>
          <span class="text-text-cs-muted text-sm">Notion</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-2xl">Zapier</span>
          <span class="text-text-cs-muted text-sm">Zapier</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-2xl">GitHub</span>
          <span class="text-text-cs-muted text-sm">GitHub</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  badge?: string
  title: string
  description: string
  showPlatforms?: boolean
}

withDefaults(defineProps<Props>(), {
  showPlatforms: true,
})
</script>
