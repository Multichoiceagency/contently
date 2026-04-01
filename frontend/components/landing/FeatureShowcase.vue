<template>
  <section class="py-16 md:py-24 bg-gray-50/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Heading -->
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-text-cs-heading">
          Everything you need
        </h2>
        <p class="mt-4 text-lg text-text-cs-muted">
          Powerful features to manage your content
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(feature, idx) in features"
          :key="idx"
          class="rounded-2xl bg-white border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
        >
          <!-- Icon Area -->
          <div
            :style="{ backgroundColor: feature.bgColor || '#E2F2FF' }"
            class="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          >
            <span class="text-2xl">{{ feature.icon }}</span>
          </div>

          <!-- Title -->
          <h3 class="text-lg font-semibold text-text-cs-heading mb-2">
            {{ feature.title }}
          </h3>

          <!-- Description -->
          <p class="text-sm text-text-cs-muted leading-relaxed">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Feature {
  icon?: string
  title: string
  description: string
  bgColor?: string
}

interface Props {
  features: Feature[]
}

defineProps<Props>()
</script>
