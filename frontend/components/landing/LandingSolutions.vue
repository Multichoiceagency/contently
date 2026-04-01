<template>
  <section class="relative py-20 md:py-32 overflow-hidden">
    <!-- Light blue gradient background -->
    <div class="absolute inset-0 bg-gradient-to-b from-cs-blue-light/30 via-transparent to-transparent pointer-events-none"></div>

    <!-- Decorative sparkle SVGs -->
    <div class="absolute top-10 left-5 w-12 h-12 opacity-40 pointer-events-none animate-pulse">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26H22L17.45 12.74L19.54 19L12 14.72L4.46 19L6.55 12.74L2 8.26H8.91L12 2Z" fill="currentColor" class="text-cs-blue"/>
      </svg>
    </div>

    <div class="absolute bottom-20 right-8 w-10 h-10 opacity-35 pointer-events-none animate-bounce">
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="3" class="text-cs-blue-light"/>
      </svg>
    </div>

    <div class="absolute top-32 right-12 w-8 h-8 opacity-30 pointer-events-none">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" class="text-cs-blue"/>
      </svg>
    </div>

    <div class="absolute bottom-32 left-1/4 w-6 h-6 opacity-25 pointer-events-none animate-pulse">
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="2" class="text-cs-blue-light"/>
      </svg>
    </div>

    <!-- Content container -->
    <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section heading -->
      <h2 class="text-3xl md:text-4xl font-semibold text-cs-heading text-center mb-6">
        Built to scale your business
      </h2>

      <!-- Subtext -->
      <p class="text-cs-muted text-center max-w-2xl mx-auto mb-16">
        From seamless onboarding to organized workspaces and quick approvals, everything is designed to help you scale smoothly.
      </p>

      <!-- Solutions grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Card 1: For Agencies -->
        <div class="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg transition duration-300">
          <!-- Placeholder image area -->
          <div class="rounded-xl h-48 bg-gradient-to-br from-cs-bg-light to-cs-bg-light mb-6 flex items-center justify-center overflow-hidden">
            <div class="w-full h-full bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 flex items-center justify-center">
              <div class="text-center opacity-50">
                <svg class="w-16 h-16 mx-auto text-cs-blue mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <p class="text-sm font-medium text-cs-muted">For Agencies</p>
              </div>
            </div>
          </div>

          <!-- Title -->
          <h3 class="text-xl font-semibold text-cs-heading mb-3">
            For Agencies
          </h3>

          <!-- Description -->
          <p class="text-cs-muted text-sm mb-6 leading-relaxed">
            Manage all your clients effortlessly from one dashboard. Streamline planning, approvals, and reporting so you can focus on results.
          </p>

          <!-- Learn more button -->
          <button class="bg-cs-blue text-white rounded-full px-6 py-2.5 text-sm font-medium hover:bg-blue-700 transition duration-200">
            Learn more
          </button>
        </div>

        <!-- Card 2: For Marketing Teams -->
        <div class="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg transition duration-300">
          <!-- Placeholder image area -->
          <div class="rounded-xl h-48 bg-gradient-to-br from-cs-bg-light to-cs-bg-light mb-6 flex items-center justify-center overflow-hidden">
            <div class="w-full h-full bg-gradient-to-br from-emerald-50 via-teal-100 to-cyan-50 flex items-center justify-center">
              <div class="text-center opacity-50">
                <svg class="w-16 h-16 mx-auto text-emerald-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <p class="text-sm font-medium text-cs-muted">For Marketing Teams</p>
              </div>
            </div>
          </div>

          <!-- Title -->
          <h3 class="text-xl font-semibold text-cs-heading mb-3">
            For Marketing Teams
          </h3>

          <!-- Description -->
          <p class="text-cs-muted text-sm mb-6 leading-relaxed">
            Keep your team aligned across channels and campaigns. Plan, schedule, and collaborate in one place while staying on-brand.
          </p>

          <!-- Learn more button -->
          <button class="bg-cs-blue text-white rounded-full px-6 py-2.5 text-sm font-medium hover:bg-blue-700 transition duration-200">
            Learn more
          </button>
        </div>

        <!-- Card 3: For Solo Creators -->
        <div class="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg transition duration-300">
          <!-- Placeholder image area -->
          <div class="rounded-xl h-48 bg-gradient-to-br from-cs-bg-light to-cs-bg-light mb-6 flex items-center justify-center overflow-hidden">
            <div class="w-full h-full bg-gradient-to-br from-pink-50 via-rose-100 to-orange-50 flex items-center justify-center">
              <div class="text-center opacity-50">
                <svg class="w-16 h-16 mx-auto text-rose-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <p class="text-sm font-medium text-cs-muted">For Solo Creators</p>
              </div>
            </div>
          </div>

          <!-- Title -->
          <h3 class="text-xl font-semibold text-cs-heading mb-3">
            For Solo Creators
          </h3>

          <!-- Description -->
          <p class="text-cs-muted text-sm mb-6 leading-relaxed">
            Automate content creation, speed up approvals, and manage multiple accounts without the stress. Focus more on creativity.
          </p>

          <!-- Learn more button -->
          <button class="bg-cs-blue text-white rounded-full px-6 py-2.5 text-sm font-medium hover:bg-blue-700 transition duration-200">
            Learn more
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Component setup - no reactive state needed for static content
</script>

<style scoped>
/* Custom animation for floating elements */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Smooth transitions for interactive elements */
button {
  @apply transition-all duration-200 ease-in-out;
}

button:active {
  @apply scale-95;
}
</style>
