<template>
  <div class="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
    <!-- Animated gradient background -->
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 animate-gradient-slow" />

    <!-- Decorative background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-slow" />
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-delayed" />
      <div class="absolute top-1/3 left-1/4 w-72 h-72 bg-pink-400/10 rounded-full blur-3xl" />
      <div class="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
    </div>

    <div class="relative w-full max-w-md">
      <!-- Logo -->
      <div class="flex items-center justify-center gap-3 mb-8">
        <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
          <svg class="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clip-rule="evenodd" />
          </svg>
        </div>
        <span class="text-white font-bold text-2xl tracking-tight">Flowgent</span>
      </div>

      <!-- Card -->
      <div class="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
        <slot />
      </div>

      <!-- Footer -->
      <p class="text-center text-white/60 text-sm mt-6">
        AI-powered social media management
      </p>
    </div>
    <Toast />
  </div>
</template>

<style scoped>
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes float-slow {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, -30px); }
}

@keyframes float-delayed {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-20px, 20px); }
}

.animate-gradient-slow {
  background-size: 200% 200%;
  animation: gradient-shift 15s ease infinite;
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 10s ease-in-out infinite;
}
</style>
