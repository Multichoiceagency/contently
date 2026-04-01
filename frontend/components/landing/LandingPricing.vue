<template>
  <section class="bg-white py-20 md:py-32">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Badge -->
      <div class="text-center mb-6">
        <span class="inline-block text-cs-blue text-sm font-medium">Simple pricing</span>
      </div>

      <!-- Heading -->
      <h2 class="text-3xl md:text-4xl font-semibold text-cs-heading text-center mb-4">
        Plans that grow with you
      </h2>

      <!-- Subtext -->
      <p class="text-cs-muted text-center mb-16">
        Start free. Upgrade when you're ready.
      </p>

      <!-- Pricing Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Starter Card -->
        <div class="rounded-2xl border border-gray-200 p-8 flex flex-col">
          <h3 class="text-xl font-semibold text-cs-heading mb-2">Starter</h3>
          <div class="mb-6">
            <span class="text-3xl font-bold text-cs-heading">$25</span>
            <span class="text-cs-muted">/mo</span>
          </div>

          <ul class="space-y-3 mb-8 flex-grow">
            <li class="flex items-start gap-3">
              <CheckIcon class="w-5 h-5 text-cs-blue flex-shrink-0 mt-0.5" />
              <span class="text-cs-body">5 social accounts</span>
            </li>
            <li class="flex items-start gap-3">
              <CheckIcon class="w-5 h-5 text-cs-blue flex-shrink-0 mt-0.5" />
              <span class="text-cs-body">AI content generation</span>
            </li>
            <li class="flex items-start gap-3">
              <CheckIcon class="w-5 h-5 text-cs-blue flex-shrink-0 mt-0.5" />
              <span class="text-cs-body">Basic analytics</span>
            </li>
            <li class="flex items-start gap-3">
              <CheckIcon class="w-5 h-5 text-cs-blue flex-shrink-0 mt-0.5" />
              <span class="text-cs-body">Content calendar</span>
            </li>
            <li class="flex items-start gap-3">
              <CheckIcon class="w-5 h-5 text-cs-blue flex-shrink-0 mt-0.5" />
              <span class="text-cs-body">Email support</span>
            </li>
          </ul>

          <button class="w-full py-3 rounded-full border border-gray-300 text-cs-heading font-medium hover:bg-gray-50 transition-colors">
            Get Started
          </button>
        </div>

        <!-- Professional Card (Most Popular) -->
        <div class="relative rounded-2xl border-2 border-cs-blue p-8 flex flex-col bg-blue-50">
          <!-- Most Popular Badge -->
          <div class="absolute -top-3 left-1/2 -translate-x-1/2">
            <span class="inline-block bg-cs-blue text-white text-xs font-medium rounded-full px-3 py-1">
              Most Popular
            </span>
          </div>

          <h3 class="text-xl font-semibold text-cs-heading mb-2">Professional</h3>
          <div class="mb-6">
            <span class="text-3xl font-bold text-cs-heading">$49</span>
            <span class="text-cs-muted">/mo</span>
          </div>

          <ul class="space-y-3 mb-8 flex-grow">
            <li class="flex items-start gap-3">
              <CheckIcon class="w-5 h-5 text-cs-blue flex-shrink-0 mt-0.5" />
              <span class="text-cs-body">15 social accounts</span>
            </li>
            <li class="flex items-start gap-3">
              <CheckIcon class="w-5 h-5 text-cs-blue flex-shrink-0 mt-0.5" />
              <span class="text-cs-body">Advanced AI features</span>
            </li>
            <li class="flex items-start gap-3">
              <CheckIcon class="w-5 h-5 text-cs-blue flex-shrink-0 mt-0.5" />
              <span class="text-cs-body">Full analytics suite</span>
            </li>
            <li class="flex items-start gap-3">
              <CheckIcon class="w-5 h-5 text-cs-blue flex-shrink-0 mt-0.5" />
              <span class="text-cs-body">Team collaboration (3 users)</span>
            </li>
            <li class="flex items-start gap-3">
              <CheckIcon class="w-5 h-5 text-cs-blue flex-shrink-0 mt-0.5" />
              <span class="text-cs-body">Priority support</span>
            </li>
            <li class="flex items-start gap-3">
              <CheckIcon class="w-5 h-5 text-cs-blue flex-shrink-0 mt-0.5" />
              <span class="text-cs-body">Content approval workflow</span>
            </li>
          </ul>

          <button class="w-full py-3 rounded-full bg-cs-blue text-white font-medium hover:bg-blue-600 transition-colors">
            Start Free Trial
          </button>
        </div>

        <!-- Agency Card -->
        <div class="rounded-2xl border border-gray-200 p-8 flex flex-col">
          <h3 class="text-xl font-semibold text-cs-heading mb-2">Agency</h3>
          <div class="mb-6">
            <span class="text-3xl font-bold text-cs-heading">$99</span>
            <span class="text-cs-muted">/mo</span>
          </div>

          <ul class="space-y-3 mb-8 flex-grow">
            <li class="flex items-start gap-3">
              <CheckIcon class="w-5 h-5 text-cs-blue flex-shrink-0 mt-0.5" />
              <span class="text-cs-body">Unlimited social accounts</span>
            </li>
            <li class="flex items-start gap-3">
              <CheckIcon class="w-5 h-5 text-cs-blue flex-shrink-0 mt-0.5" />
              <span class="text-cs-body">White-label reports</span>
            </li>
            <li class="flex items-start gap-3">
              <CheckIcon class="w-5 h-5 text-cs-blue flex-shrink-0 mt-0.5" />
              <span class="text-cs-body">Unlimited team members</span>
            </li>
            <li class="flex items-start gap-3">
              <CheckIcon class="w-5 h-5 text-cs-blue flex-shrink-0 mt-0.5" />
              <span class="text-cs-body">Custom AI training</span>
            </li>
            <li class="flex items-start gap-3">
              <CheckIcon class="w-5 h-5 text-cs-blue flex-shrink-0 mt-0.5" />
              <span class="text-cs-body">Dedicated account manager</span>
            </li>
            <li class="flex items-start gap-3">
              <CheckIcon class="w-5 h-5 text-cs-blue flex-shrink-0 mt-0.5" />
              <span class="text-cs-body">API access</span>
            </li>
          </ul>

          <button class="w-full py-3 rounded-full border border-gray-300 text-cs-heading font-medium hover:bg-gray-50 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/24/solid'
</script>

<style scoped>
/* Additional styling if needed */
</style>
