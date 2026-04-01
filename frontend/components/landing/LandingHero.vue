<template>
  <section class="relative overflow-hidden bg-gradient-to-b from-white via-white to-blue-50" style="background: linear-gradient(to bottom, #ffffff 0%, #ffffff 30%, #fafcff 60%, #e2f2ff 100%)">
    <!-- Decorative background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
    </div>

    <!-- Content container -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
      <!-- Badge -->
      <div class="flex justify-center mb-8 animate-fade-in">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50/50 backdrop-blur-sm">
          <span class="text-sm font-medium text-cs-blue">✨ Create content 10X faster with AI</span>
        </div>
      </div>

      <!-- Main heading -->
      <h1 class="text-5xl sm:text-6xl md:text-7xl font-semibold text-center text-cs-heading leading-tight max-w-4xl mx-auto mb-6 animate-fade-in-up">
        The easiest way to manage and grow your social channels
      </h1>

      <!-- Subtext -->
      <p class="text-lg text-cs-muted text-center max-w-2xl mx-auto mb-8 animate-fade-in">
        Stay organized and get more done in less time with our simple yet powerful social media management tool for agencies, brands, and marketers.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-fade-in">
        <a
          :href="dashboardUrl + '/auth/register'"
          class="inline-flex items-center justify-center px-7 py-4 rounded-full bg-cs-blue text-white text-sm font-medium shadow-lg shadow-blue-500/20 hover:bg-cs-blue-dark transition-all duration-300 transform hover:scale-105"
        >
          Get started for free
        </a>
        <NuxtLink
          to="/demo"
          class="inline-flex items-center justify-center px-10 py-4 rounded-full bg-white text-cs-body text-sm font-medium border border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:scale-105"
        >
          Book a demo
        </NuxtLink>
      </div>

      <!-- Trial info -->
      <p class="text-sm text-cs-muted text-center mb-12 animate-fade-in">
        14-day free trial · No credit card required.
      </p>

      <!-- Integrated platforms -->
      <div class="mb-16 animate-fade-in">
        <p class="text-sm text-cs-muted text-center mb-6">Integrated with</p>
        <div class="flex items-center justify-center gap-8 flex-wrap">
          <!-- Facebook -->
          <div class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>

          <!-- Instagram -->
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22.5C6.201 22.5 1.5 17.799 1.5 12S6.201 1.5 12 1.5 22.5 6.201 22.5 12 17.799 22.5 12 22.5zm3.915-11.25a3.915 3.915 0 11-7.83 0 3.915 3.915 0 017.83 0zm1.455-5.625a.938.938 0 11-1.875 0 .938.938 0 011.875 0z" />
            </svg>
          </div>

          <!-- YouTube -->
          <div class="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>

          <!-- LinkedIn -->
          <div class="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
            </svg>
          </div>

          <!-- Pinterest -->
          <div class="w-12 h-12 rounded-full bg-red-700 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.223-.937 1.58-6.685 1.58-6.685s-.4-.8-.4-1.983c0-1.86 1.076-3.246 2.414-3.246 1.141 0 1.691.855 1.691 1.879 0 1.143-.728 2.85-1.104 4.432-.314 1.324.627 2.401 1.872 2.401 2.247 0 3.97-2.373 3.97-5.801 0-3.033-2.176-5.15-5.28-5.15-3.6 0-5.71 2.693-5.71 5.475 0 1.084.387 2.247 1.097 2.88.122.143.14.27.104.414-.114.475-.368 1.552-.42 1.77-.06.25-.196.304-.402.184-2.009-1.338-3.265-5.556-3.265-8.945 0-3.974 2.887-7.63 8.322-7.63 4.37 0 7.76 3.116 7.76 7.284 0 4.348-2.743 7.84-6.556 7.84-1.282 0-2.49-.665-2.898-1.451 0 0-.634 2.406-.789 2.998-.286 1.097-.906 2.197-1.342 3.022 1.01.312 2.08.48 3.19.48 6.627 0 12-5.373 12-12S18.627 0 12 0z" />
            </svg>
          </div>

          <!-- TikTok -->
          <div class="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.72 2.89 2.89 0 0 1 2.31-4.64 2.86 2.86 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.07 6.85 6.85 0 1 0 6.85 6.85V9.8a8.02 8.02 0 0 0 4.4 1.25v-3.3a4.85 4.85 0 0 1-.36-.04z" />
            </svg>
          </div>

          <!-- Twitter/X -->
          <div class="w-12 h-12 rounded-full bg-black flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.207-6.807-5.974 6.807H2.882l7.432-8.493H1.077l5.313-6.407h6.552l4.902 6.423ZM17.15 18.348h1.838L5.312 4.151H3.561l13.589 14.197Z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Mockup card section -->
      <div class="animate-fade-in">
        <div class="relative max-w-4xl mx-auto">
          <!-- Card with shadow and border -->
          <div class="relative rounded-3xl border border-blue-100/50 bg-gradient-to-br from-blue-50/50 to-white shadow-2xl overflow-hidden">
            <!-- Decorative gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />

            <!-- Content preview -->
            <div class="relative p-8 sm:p-12">
              <!-- Header of mockup -->
              <div class="mb-8">
                <div class="flex items-center justify-between mb-6">
                  <div class="h-3 w-32 bg-gray-300 rounded-full" />
                  <div class="flex gap-2">
                    <div class="h-2 w-2 bg-gray-300 rounded-full" />
                    <div class="h-2 w-2 bg-gray-300 rounded-full" />
                    <div class="h-2 w-2 bg-gray-300 rounded-full" />
                  </div>
                </div>

                <!-- Calendar grid preview -->
                <div class="grid grid-cols-7 gap-3 mb-6">
                  <div v-for="day in 7" :key="day" class="h-3 bg-gray-200 rounded-full" />
                </div>

                <!-- Calendar content -->
                <div class="space-y-3">
                  <div class="h-4 w-full bg-gradient-to-r from-blue-200 to-blue-100 rounded-lg" />
                  <div class="h-4 w-5/6 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg" />
                  <div class="h-4 w-4/5 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg" />
                </div>
              </div>

              <!-- Additional preview rows -->
              <div class="space-y-4">
                <div class="flex gap-3">
                  <div class="h-12 w-12 bg-gray-200 rounded-lg flex-shrink-0" />
                  <div class="flex-1 space-y-2">
                    <div class="h-2 w-24 bg-gray-300 rounded-full" />
                    <div class="h-2 w-32 bg-gray-200 rounded-full" />
                  </div>
                </div>

                <div class="flex gap-3">
                  <div class="h-12 w-12 bg-blue-200 rounded-lg flex-shrink-0" />
                  <div class="flex-1 space-y-2">
                    <div class="h-2 w-20 bg-gray-300 rounded-full" />
                    <div class="h-2 w-32 bg-gray-200 rounded-full" />
                  </div>
                </div>

                <div class="flex gap-3">
                  <div class="h-12 w-12 bg-purple-200 rounded-lg flex-shrink-0" />
                  <div class="flex-1 space-y-2">
                    <div class="h-2 w-28 bg-gray-300 rounded-full" />
                    <div class="h-2 w-32 bg-gray-200 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Floating accent elements -->
          <div class="absolute -top-8 -right-8 w-24 h-24 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-float" />
          <div class="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-float animation-delay-3000" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const config = useRuntimeConfig()
const dashboardUrl = computed(() => {
  if (import.meta.client) {
    const hostname = window.location.hostname
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return ''
    }
  }
  const domain = config.public.dashboardDomain || 'dashboard.contentrich.nl'
  return `https://${domain}`
})
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out 0.2s forwards;
  opacity: 0;
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-3000 {
  animation-delay: 3s;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>
