<template>
  <div class="min-h-screen bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 flex items-center justify-center p-4">
    <!-- Decorative background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl" />
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-400/20 rounded-full blur-3xl" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-3xl" />
    </div>

    <div class="relative w-full max-w-md">
      <!-- Logo -->
      <div class="flex items-center justify-center gap-3 mb-8">
        <div class="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
          <span class="text-white font-bold text-lg">F</span>
        </div>
        <span class="text-white font-bold text-2xl tracking-tight">Flowgent</span>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <slot />
      </div>

      <!-- Footer -->
      <p class="text-center text-brand-300 text-sm mt-6">
        AI-powered social media management
      </p>
    </div>
    <Toast />
  </div>
</template>
