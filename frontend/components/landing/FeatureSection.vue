<template>
  <section :class="`py-16 md:py-24 ${bgColor}`">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12 items-center" :class="imagePosition === 'left' ? 'lg:auto-cols-fr' : ''">
        <!-- Text Side -->
        <div :class="imagePosition === 'right' ? '' : 'order-2 lg:order-none'">
          <h2 class="text-2xl font-semibold text-text-cs-heading mb-4">
            {{ title }}
          </h2>

          <p class="text-text-cs-body mb-8">
            {{ description }}
          </p>

          <!-- Features List -->
          <ul class="space-y-4 mb-8">
            <li
              v-for="(feature, idx) in features"
              :key="idx"
              class="flex items-start gap-3"
            >
              <svg class="w-5 h-5 text-text-cs-blue flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="text-text-cs-body">{{ feature.text }}</span>
            </li>
          </ul>

          <!-- CTA Button -->
          <button class="px-8 py-3 bg-cs-blue text-white rounded-full font-semibold hover:bg-cs-blue-dark transition-colors duration-200">
            Learn more
          </button>
        </div>

        <!-- Image Side - Mockup Placeholder -->
        <div :class="imagePosition === 'left' ? 'order-1 lg:order-none' : ''">
          <div class="rounded-2xl bg-gradient-to-br from-blue-50 via-blue-25 to-gray-50 p-8 aspect-square flex items-center justify-center shadow-md border border-gray-100">
            <!-- Polished Skeleton UI Elements -->
            <div class="w-full space-y-4">
              <div class="h-3 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full w-3/4 opacity-60"></div>
              <div class="h-3 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full w-full opacity-50"></div>
              <div class="h-3 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full w-2/3 opacity-40"></div>
              <div class="mt-8 space-y-3">
                <div class="h-10 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg opacity-40"></div>
                <div class="h-10 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg opacity-30"></div>
              </div>
              <div class="mt-8 flex gap-2">
                <div class="h-2 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full w-1/3 opacity-30"></div>
                <div class="h-2 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full w-1/4 opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Feature {
  icon?: string
  text: string
}

interface Props {
  title: string
  description: string
  features: Feature[]
  imagePosition?: 'left' | 'right'
  bgColor?: string
}

withDefaults(defineProps<Props>(), {
  imagePosition: 'right',
  bgColor: 'bg-white',
})
</script>
