<template>
  <section class="py-16 md:py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Heading -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-semibold text-text-cs-heading">
          What's included
        </h2>
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <div
          v-for="(item, idx) in items"
          :key="idx"
          class="flex flex-col items-center text-center"
        >
          <!-- Icon -->
          <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
            <span class="text-2xl">{{ item.icon }}</span>
          </div>

          <!-- Title -->
          <h3 class="text-sm font-semibold text-text-cs-heading mb-2">
            {{ item.title }}
          </h3>

          <!-- Description -->
          <p class="text-xs text-text-cs-muted leading-relaxed">
            {{ item.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Item {
  icon: string
  title: string
  description: string
}

interface Props {
  items: Item[]
}

defineProps<Props>()
</script>
