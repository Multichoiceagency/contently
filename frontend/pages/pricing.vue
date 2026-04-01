<template>
  <div class="min-h-screen bg-white">
    <LandingNavbar />

    <!-- SECTION 1: Hero -->
    <section class="relative bg-gradient-to-b from-white to-blue-50 py-16 md:py-24">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 class="text-center text-4xl font-semibold text-cs-heading md:text-5xl">
          Simple, transparent pricing
        </h1>
        <p class="mt-6 text-center text-lg text-cs-muted">
          Choose the plan that fits your needs. Start free, upgrade anytime.
        </p>

        <!-- Billing Toggle -->
        <div class="mt-12 flex items-center justify-center gap-4">
          <div class="inline-flex gap-1 rounded-full bg-gray-100 p-1">
            <button
              @click="billingPeriod = 'monthly'"
              :class="[
                'px-6 py-2 rounded-full font-medium transition-all',
                billingPeriod === 'monthly'
                  ? 'bg-white text-cs-heading shadow-md'
                  : 'text-cs-muted'
              ]"
            >
              Monthly
            </button>
            <button
              @click="billingPeriod = 'yearly'"
              :class="[
                'px-6 py-2 rounded-full font-medium transition-all',
                billingPeriod === 'yearly'
                  ? 'bg-white text-cs-heading shadow-md'
                  : 'text-cs-muted'
              ]"
            >
              Yearly
            </button>
          </div>
          <div
            v-if="billingPeriod === 'yearly'"
            class="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
          >
            Save up to 34%
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2: Pricing Cards -->
    <section class="py-16 md:py-24">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <!-- Starter Card -->
          <div class="flex flex-col rounded-2xl border border-gray-200 p-8 transition-shadow hover:shadow-lg">
            <div>
              <h3 class="text-xl font-semibold text-cs-heading">Starter</h3>
              <div class="mt-4">
                <span class="text-4xl font-bold text-cs-heading">
                  {{ billingPeriod === 'monthly' ? '$19' : '$13' }}
                </span>
                <span class="text-cs-muted">/mo</span>
              </div>
              <p class="mt-2 text-sm text-cs-muted">For individuals getting started</p>
            </div>

            <ul class="mt-8 space-y-4 flex-grow">
              <li class="flex gap-3">
                <CheckIcon class="h-5 w-5 flex-shrink-0 text-cs-blue" />
                <span class="text-sm text-cs-heading">1 workspace</span>
              </li>
              <li class="flex gap-3">
                <CheckIcon class="h-5 w-5 flex-shrink-0 text-cs-blue" />
                <span class="text-sm text-cs-heading">5 social accounts</span>
              </li>
              <li class="flex gap-3">
                <CheckIcon class="h-5 w-5 flex-shrink-0 text-cs-blue" />
                <span class="text-sm text-cs-heading">1 user</span>
              </li>
              <li class="flex gap-3">
                <CheckIcon class="h-5 w-5 flex-shrink-0 text-cs-blue" />
                <span class="text-sm text-cs-heading">50 AI credits/month</span>
              </li>
              <li class="flex gap-3">
                <CheckIcon class="h-5 w-5 flex-shrink-0 text-cs-blue" />
                <span class="text-sm text-cs-heading">Basic analytics</span>
              </li>
            </ul>

            <button class="mt-8 w-full rounded-full border border-cs-heading py-3 font-medium text-cs-heading transition-colors hover:bg-gray-50">
              Get Started
            </button>
          </div>

          <!-- Advanced Card (Popular) -->
          <div class="relative flex flex-col rounded-2xl border-2 border-cs-blue p-8 transition-shadow hover:shadow-lg">
            <div class="absolute -top-3 left-1/2 -translate-x-1/2">
              <div class="rounded-full bg-cs-blue px-3 py-1 text-xs font-semibold text-white">
                Most Popular
              </div>
            </div>

            <div>
              <h3 class="text-xl font-semibold text-cs-heading">Advanced</h3>
              <div class="mt-4">
                <span class="text-4xl font-bold text-cs-heading">
                  {{ billingPeriod === 'monthly' ? '$49' : '$33' }}
                </span>
                <span class="text-cs-muted">/mo</span>
              </div>
              <p class="mt-2 text-sm text-cs-muted">For growing businesses</p>
            </div>

            <ul class="mt-8 space-y-4 flex-grow">
              <li class="flex gap-3">
                <CheckIcon class="h-5 w-5 flex-shrink-0 text-cs-blue" />
                <span class="text-sm text-cs-heading">5 workspaces</span>
              </li>
              <li class="flex gap-3">
                <CheckIcon class="h-5 w-5 flex-shrink-0 text-cs-blue" />
                <span class="text-sm text-cs-heading">15 social accounts</span>
              </li>
              <li class="flex gap-3">
                <CheckIcon class="h-5 w-5 flex-shrink-0 text-cs-blue" />
                <span class="text-sm text-cs-heading">5 users</span>
              </li>
              <li class="flex gap-3">
                <CheckIcon class="h-5 w-5 flex-shrink-0 text-cs-blue" />
                <span class="text-sm text-cs-heading">500 AI credits/month</span>
              </li>
              <li class="flex gap-3">
                <CheckIcon class="h-5 w-5 flex-shrink-0 text-cs-blue" />
                <span class="text-sm text-cs-heading">Full analytics</span>
              </li>
              <li class="flex gap-3">
                <CheckIcon class="h-5 w-5 flex-shrink-0 text-cs-blue" />
                <span class="text-sm text-cs-heading">Approval workflows</span>
              </li>
            </ul>

            <button class="mt-8 w-full rounded-full bg-cs-blue py-3 font-medium text-white transition-colors hover:bg-blue-700">
              Start Free Trial
            </button>
          </div>

          <!-- Agency Card -->
          <div class="flex flex-col rounded-2xl border border-gray-200 p-8 transition-shadow hover:shadow-lg">
            <div>
              <h3 class="text-xl font-semibold text-cs-heading">Agency</h3>
              <div class="mt-4">
                <span class="text-4xl font-bold text-cs-heading">
                  {{ billingPeriod === 'monthly' ? '$99' : '$66' }}
                </span>
                <span class="text-cs-muted">/mo</span>
              </div>
              <p class="mt-2 text-sm text-cs-muted">For agencies and teams</p>
            </div>

            <ul class="mt-8 space-y-4 flex-grow">
              <li class="flex gap-3">
                <CheckIcon class="h-5 w-5 flex-shrink-0 text-cs-blue" />
                <span class="text-sm text-cs-heading">Unlimited workspaces</span>
              </li>
              <li class="flex gap-3">
                <CheckIcon class="h-5 w-5 flex-shrink-0 text-cs-blue" />
                <span class="text-sm text-cs-heading">50 social accounts</span>
              </li>
              <li class="flex gap-3">
                <CheckIcon class="h-5 w-5 flex-shrink-0 text-cs-blue" />
                <span class="text-sm text-cs-heading">15 users</span>
              </li>
              <li class="flex gap-3">
                <CheckIcon class="h-5 w-5 flex-shrink-0 text-cs-blue" />
                <span class="text-sm text-cs-heading">Unlimited AI credits</span>
              </li>
              <li class="flex gap-3">
                <CheckIcon class="h-5 w-5 flex-shrink-0 text-cs-blue" />
                <span class="text-sm text-cs-heading">White-label reports</span>
              </li>
              <li class="flex gap-3">
                <CheckIcon class="h-5 w-5 flex-shrink-0 text-cs-blue" />
                <span class="text-sm text-cs-heading">Priority support</span>
              </li>
            </ul>

            <button class="mt-8 w-full rounded-full border border-cs-heading py-3 font-medium text-cs-heading transition-colors hover:bg-gray-50">
              Get Started
            </button>
          </div>

          <!-- Enterprise Card -->
          <div class="flex flex-col rounded-2xl border border-gray-200 p-8 transition-shadow hover:shadow-lg">
            <div>
              <h3 class="text-xl font-semibold text-cs-heading">Enterprise</h3>
              <div class="mt-4">
                <span class="text-3xl font-bold text-cs-heading">Custom</span>
              </div>
              <p class="mt-2 text-sm text-cs-muted">For large organizations</p>
            </div>

            <ul class="mt-8 space-y-4 flex-grow">
              <li class="flex gap-3">
                <CheckIcon class="h-5 w-5 flex-shrink-0 text-cs-blue" />
                <span class="text-sm text-cs-heading">Custom everything</span>
              </li>
              <li class="flex gap-3">
                <CheckIcon class="h-5 w-5 flex-shrink-0 text-cs-blue" />
                <span class="text-sm text-cs-heading">Dedicated account manager</span>
              </li>
              <li class="flex gap-3">
                <CheckIcon class="h-5 w-5 flex-shrink-0 text-cs-blue" />
                <span class="text-sm text-cs-heading">Custom integrations</span>
              </li>
              <li class="flex gap-3">
                <CheckIcon class="h-5 w-5 flex-shrink-0 text-cs-blue" />
                <span class="text-sm text-cs-heading">SLA guarantee</span>
              </li>
            </ul>

            <button class="mt-8 w-full rounded-full border border-cs-heading py-3 font-medium text-cs-heading transition-colors hover:bg-gray-50">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 3: Feature Comparison Table -->
    <section class="py-16 md:py-24">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 class="text-center text-3xl font-semibold text-cs-heading md:text-4xl">
          Compare all features
        </h2>

        <div class="mt-12 overflow-x-auto">
          <table class="w-full min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold text-cs-heading">Feature</th>
                <th class="px-6 py-4 text-center text-sm font-semibold text-cs-heading">Starter</th>
                <th class="px-6 py-4 text-center text-sm font-semibold text-cs-heading">Advanced</th>
                <th class="px-6 py-4 text-center text-sm font-semibold text-cs-heading">Agency</th>
                <th class="px-6 py-4 text-center text-sm font-semibold text-cs-heading">Enterprise</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <!-- Publishing Section -->
              <tr class="bg-gray-50">
                <td colspan="5" class="px-6 py-3 text-sm font-semibold text-cs-heading">
                  Publishing
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-cs-heading">Social accounts</td>
                <td class="px-6 py-4 text-center text-sm text-cs-heading">5</td>
                <td class="px-6 py-4 text-center text-sm text-cs-heading">15</td>
                <td class="px-6 py-4 text-center text-sm text-cs-heading">50</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue font-medium">Custom</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-cs-heading">Post scheduling</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-cs-heading">Content calendar</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-cs-heading">AI-powered copywriting</td>
                <td class="px-6 py-4 text-center text-sm text-gray-400">—</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-cs-heading">Image generation</td>
                <td class="px-6 py-4 text-center text-sm text-gray-400">—</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
              </tr>

              <!-- Analytics Section -->
              <tr class="bg-gray-50">
                <td colspan="5" class="px-6 py-3 text-sm font-semibold text-cs-heading">
                  Analytics
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-cs-heading">Basic analytics</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-cs-heading">Advanced analytics</td>
                <td class="px-6 py-4 text-center text-sm text-gray-400">—</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-cs-heading">Custom reports</td>
                <td class="px-6 py-4 text-center text-sm text-gray-400">—</td>
                <td class="px-6 py-4 text-center text-sm text-gray-400">—</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-cs-heading">White-label reports</td>
                <td class="px-6 py-4 text-center text-sm text-gray-400">—</td>
                <td class="px-6 py-4 text-center text-sm text-gray-400">—</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-cs-heading">Sentiment analysis</td>
                <td class="px-6 py-4 text-center text-sm text-gray-400">—</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
              </tr>

              <!-- Collaboration Section -->
              <tr class="bg-gray-50">
                <td colspan="5" class="px-6 py-3 text-sm font-semibold text-cs-heading">
                  Collaboration
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-cs-heading">Team members</td>
                <td class="px-6 py-4 text-center text-sm text-cs-heading">1</td>
                <td class="px-6 py-4 text-center text-sm text-cs-heading">5</td>
                <td class="px-6 py-4 text-center text-sm text-cs-heading">15</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue font-medium">Unlimited</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-cs-heading">Role-based permissions</td>
                <td class="px-6 py-4 text-center text-sm text-gray-400">—</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-cs-heading">Approval workflows</td>
                <td class="px-6 py-4 text-center text-sm text-gray-400">—</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-cs-heading">Comments and feedback</td>
                <td class="px-6 py-4 text-center text-sm text-gray-400">—</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-cs-heading">Client workspaces</td>
                <td class="px-6 py-4 text-center text-sm text-gray-400">—</td>
                <td class="px-6 py-4 text-center text-sm text-gray-400">—</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
              </tr>

              <!-- Support Section -->
              <tr class="bg-gray-50">
                <td colspan="5" class="px-6 py-3 text-sm font-semibold text-cs-heading">
                  Support
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-cs-heading">Email support</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-cs-heading">Priority support</td>
                <td class="px-6 py-4 text-center text-sm text-gray-400">—</td>
                <td class="px-6 py-4 text-center text-sm text-gray-400">—</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-cs-heading">Dedicated account manager</td>
                <td class="px-6 py-4 text-center text-sm text-gray-400">—</td>
                <td class="px-6 py-4 text-center text-sm text-gray-400">—</td>
                <td class="px-6 py-4 text-center text-sm text-gray-400">—</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-cs-heading">SLA guarantee</td>
                <td class="px-6 py-4 text-center text-sm text-gray-400">—</td>
                <td class="px-6 py-4 text-center text-sm text-gray-400">—</td>
                <td class="px-6 py-4 text-center text-sm text-gray-400">—</td>
                <td class="px-6 py-4 text-center text-sm text-cs-blue">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- SECTION 4: FAQ -->
    <section class="py-16 md:py-24">
      <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 class="text-center text-3xl font-semibold text-cs-heading md:text-4xl">
          Frequently asked questions
        </h2>

        <div class="mt-12 space-y-4">
          <!-- FAQ Item 1 -->
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <button
              @click="toggleFaq(0)"
              class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span class="font-medium text-cs-heading text-left">Do you offer a free trial?</span>
              <svg
                class="w-5 h-5 text-cs-muted transition-transform"
                :class="{ 'rotate-180': openFaq === 0 }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
            <div v-if="openFaq === 0" class="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p class="text-sm text-cs-muted">
                Yes! All plans come with a 14-day free trial. No credit card required to get started.
              </p>
            </div>
          </div>

          <!-- FAQ Item 2 -->
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <button
              @click="toggleFaq(1)"
              class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span class="font-medium text-cs-heading text-left">Do I need to provide a credit card?</span>
              <svg
                class="w-5 h-5 text-cs-muted transition-transform"
                :class="{ 'rotate-180': openFaq === 1 }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
            <div v-if="openFaq === 1" class="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p class="text-sm text-cs-muted">
                No credit card is required to start your free trial. You'll only be charged when your trial
                ends if you choose to subscribe.
              </p>
            </div>
          </div>

          <!-- FAQ Item 3 -->
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <button
              @click="toggleFaq(2)"
              class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span class="font-medium text-cs-heading text-left">Can I switch plans anytime?</span>
              <svg
                class="w-5 h-5 text-cs-muted transition-transform"
                :class="{ 'rotate-180': openFaq === 2 }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
            <div v-if="openFaq === 2" class="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p class="text-sm text-cs-muted">
                Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately,
                and we'll prorate any charges or credits.
              </p>
            </div>
          </div>

          <!-- FAQ Item 4 -->
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <button
              @click="toggleFaq(3)"
              class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span class="font-medium text-cs-heading text-left">What's your cancellation policy?</span>
              <svg
                class="w-5 h-5 text-cs-muted transition-transform"
                :class="{ 'rotate-180': openFaq === 3 }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
            <div v-if="openFaq === 3" class="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p class="text-sm text-cs-muted">
                You can cancel your subscription anytime from your account settings. No questions asked, and
                you'll have access until the end of your billing period.
              </p>
            </div>
          </div>

          <!-- FAQ Item 5 -->
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <button
              @click="toggleFaq(4)"
              class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span class="font-medium text-cs-heading text-left">How many workspaces can I create?</span>
              <svg
                class="w-5 h-5 text-cs-muted transition-transform"
                :class="{ 'rotate-180': openFaq === 4 }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
            <div v-if="openFaq === 4" class="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p class="text-sm text-cs-muted">
                The number of workspaces depends on your plan. Starter includes 1 workspace, Advanced includes
                5, and Agency includes unlimited workspaces. Enterprise plans can be customized.
              </p>
            </div>
          </div>

          <!-- FAQ Item 6 -->
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <button
              @click="toggleFaq(5)"
              class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span class="font-medium text-cs-heading text-left">What if I exceed my social account limit?</span>
              <svg
                class="w-5 h-5 text-cs-muted transition-transform"
                :class="{ 'rotate-180': openFaq === 5 }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
            <div v-if="openFaq === 5" class="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p class="text-sm text-cs-muted">
                You can add additional social accounts by upgrading your plan or purchasing add-ons. We'll
                notify you when you're approaching your limit.
              </p>
            </div>
          </div>

          <!-- FAQ Item 7 -->
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <button
              @click="toggleFaq(6)"
              class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span class="font-medium text-cs-heading text-left">How do AI credits work?</span>
              <svg
                class="w-5 h-5 text-cs-muted transition-transform"
                :class="{ 'rotate-180': openFaq === 6 }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
            <div v-if="openFaq === 6" class="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p class="text-sm text-cs-muted">
                AI credits are used for AI-powered features like copywriting and image generation. Each feature
                uses a different number of credits. Unused credits roll over to the next month.
              </p>
            </div>
          </div>

          <!-- FAQ Item 8 -->
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <button
              @click="toggleFaq(7)"
              class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span class="font-medium text-cs-heading text-left">What kind of support do you offer?</span>
              <svg
                class="w-5 h-5 text-cs-muted transition-transform"
                :class="{ 'rotate-180': openFaq === 7 }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
            <div v-if="openFaq === 7" class="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p class="text-sm text-cs-muted">
                All plans include email support. Advanced plans get priority support, and Enterprise plans
                include a dedicated account manager and SLA guarantee.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 5: Bottom CTA -->
    <section class="py-16 md:py-24">
      <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div class="rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 p-12 text-center">
          <h2 class="text-3xl font-semibold text-cs-heading md:text-4xl">
            Ready to get started?
          </h2>
          <p class="mt-4 text-lg text-cs-muted">
            Join thousands of marketers who are already managing their social media smarter.
          </p>
          <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button class="rounded-full bg-cs-blue px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700">
              Start Free Trial
            </button>
            <button class="rounded-full border border-cs-heading px-8 py-3 font-medium text-cs-heading transition-colors hover:bg-white">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>

    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/solid'

definePageMeta({
  layout: 'landing'
})

const billingPeriod = ref<'monthly' | 'yearly'>('monthly')
const openFaq = ref<number | null>(null)

const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index
}
</script>

<style scoped>
/* Add any component-specific styles here if needed */
</style>
