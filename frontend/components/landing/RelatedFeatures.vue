<template>
  <section class="py-16 md:py-24 bg-white border-t border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Heading -->
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-text-cs-heading">
          Explore more features
        </h2>
        <p class="mt-4 text-lg text-text-cs-muted">
          Discover other powerful tools to grow your business
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-3 gap-6">
        <div
          v-for="(feature, idx) in features"
          :key="idx"
          class="rounded-2xl border border-gray-200 p-6 bg-white hover:shadow-lg transition-shadow"
        >
          <!-- Colored Top Accent Band -->
          <div
            :style="{ backgroundColor: feature.bgColor || ['#3B82F6', '#10B981', '#F59E0B'][idx % 3] }"
            class="h-1.5 w-16 rounded-full mb-6"
          ></div>

          <!-- Title -->
          <h3 class="text-xl font-semibold text-text-cs-heading mb-3">
            {{ feature.title }}
          </h3>

          <!-- Description -->
          <p class="text-sm text-text-cs-muted mb-6 leading-relaxed">
            {{ feature.description }}
          </p>

          <!-- Learn More Link -->
          <a :href="feature.link" class="text-cs-blue hover:text-cs-blue-dark font-semibold text-sm inline-flex items-center gap-2 transition-colors">
            Learn more
            <span class="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Feature {
  title: string
  description: string
  link: string
  bgColor: string
}

interface Props {
  features: Feature[]
}

defineProps<Props>()
</script>
