<template>
  <footer class="bg-[#171717] text-white py-16 md:py-20">
    <div class="max-w-7xl mx-auto px-6">
      <!-- Top Section - 5 Column Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        <!-- Column 1 - Product -->
        <div>
          <h3 class="text-white font-semibold text-sm uppercase tracking-wider mb-5">
            Product
          </h3>
          <ul class="space-y-3 flex flex-col">
            <li>
              <NuxtLink to="/publish" class="text-gray-400 text-sm hover:text-white transition-colors">
                Publish
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/ai-studio" class="text-gray-400 text-sm hover:text-white transition-colors">
                AI Studio
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/analyze" class="text-gray-400 text-sm hover:text-white transition-colors">
                Analyze
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/engage" class="text-gray-400 text-sm hover:text-white transition-colors">
                Engage
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/discover" class="text-gray-400 text-sm hover:text-white transition-colors">
                Discover
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/pricing" class="text-gray-400 text-sm hover:text-white transition-colors">
                Plans & Pricing
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Column 2 - Features -->
        <div>
          <h3 class="text-white font-semibold text-sm uppercase tracking-wider mb-5">
            Features
          </h3>
          <ul class="space-y-3 flex flex-col">
            <li>
              <NuxtLink to="/publish" class="text-gray-400 text-sm hover:text-white transition-colors">
                Content Calendar
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/publish" class="text-gray-400 text-sm hover:text-white transition-colors">
                Media Library
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/publish" class="text-gray-400 text-sm hover:text-white transition-colors">
                Bulk Scheduling
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/publish" class="text-gray-400 text-sm hover:text-white transition-colors">
                Content Approval
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/ai-studio" class="text-gray-400 text-sm hover:text-white transition-colors">
                AI Content Generation
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/analyze" class="text-gray-400 text-sm hover:text-white transition-colors">
                Social Analytics
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Column 3 - Platforms -->
        <div>
          <h3 class="text-white font-semibold text-sm uppercase tracking-wider mb-5">
            Platforms
          </h3>
          <ul class="space-y-3 flex flex-col">
            <li>
              <NuxtLink to="/publish" class="text-gray-400 text-sm hover:text-white transition-colors">
                Facebook Scheduler
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/publish" class="text-gray-400 text-sm hover:text-white transition-colors">
                Instagram Scheduler
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/publish" class="text-gray-400 text-sm hover:text-white transition-colors">
                LinkedIn Scheduler
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/publish" class="text-gray-400 text-sm hover:text-white transition-colors">
                TikTok Scheduler
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/publish" class="text-gray-400 text-sm hover:text-white transition-colors">
                YouTube Scheduler
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/publish" class="text-gray-400 text-sm hover:text-white transition-colors">
                Pinterest Scheduler
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Column 4 - Solutions -->
        <div>
          <h3 class="text-white font-semibold text-sm uppercase tracking-wider mb-5">
            Solutions
          </h3>
          <ul class="space-y-3 flex flex-col">
            <li>
              <NuxtLink to="/solutions/agencies" class="text-gray-400 text-sm hover:text-white transition-colors">
                For Agencies
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/solutions/teams" class="text-gray-400 text-sm hover:text-white transition-colors">
                For Marketing Teams
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/solutions/creators" class="text-gray-400 text-sm hover:text-white transition-colors">
                For Solo Creators
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/solutions/ecommerce" class="text-gray-400 text-sm hover:text-white transition-colors">
                Ecommerce & Retail
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/solutions/travel" class="text-gray-400 text-sm hover:text-white transition-colors">
                Travel & Tourism
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/solutions/health" class="text-gray-400 text-sm hover:text-white transition-colors">
                Health & Wellness
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Column 5 - Company -->
        <div>
          <h3 class="text-white font-semibold text-sm uppercase tracking-wider mb-5">
            Company
          </h3>
          <ul class="space-y-3 flex flex-col">
            <li>
              <NuxtLink to="/about" class="text-gray-400 text-sm hover:text-white transition-colors">
                About Us
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/blog" class="text-gray-400 text-sm hover:text-white transition-colors">
                Blog
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/changelog" class="text-gray-400 text-sm hover:text-white transition-colors">
                Changelog
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/api" class="text-gray-400 text-sm hover:text-white transition-colors">
                API
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/affiliate" class="text-gray-400 text-sm hover:text-white transition-colors">
                Affiliate Program
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact" class="text-gray-400 text-sm hover:text-white transition-colors">
                Contact Us
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/careers" class="text-gray-400 text-sm hover:text-white transition-colors">
                Careers
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Middle Section - Tool Pills -->
      <div class="mt-12 pt-8 border-t border-gray-800">
        <div class="flex flex-wrap justify-center gap-3">
          <a href="#" class="text-xs text-gray-400 border border-gray-700 rounded-full px-4 py-2 hover:border-gray-500 hover:text-gray-300 transition">
            AI Caption Generator
          </a>
          <a href="#" class="text-xs text-gray-400 border border-gray-700 rounded-full px-4 py-2 hover:border-gray-500 hover:text-gray-300 transition">
            Hashtag Generator
          </a>
          <a href="#" class="text-xs text-gray-400 border border-gray-700 rounded-full px-4 py-2 hover:border-gray-500 hover:text-gray-300 transition">
            Social Media Calendar
          </a>
          <a href="#" class="text-xs text-gray-400 border border-gray-700 rounded-full px-4 py-2 hover:border-gray-500 hover:text-gray-300 transition">
            Content Planner
          </a>
          <a href="#" class="text-xs text-gray-400 border border-gray-700 rounded-full px-4 py-2 hover:border-gray-500 hover:text-gray-300 transition">
            Post Scheduler
          </a>
          <a href="#" class="text-xs text-gray-400 border border-gray-700 rounded-full px-4 py-2 hover:border-gray-500 hover:text-gray-300 transition">
            Analytics Dashboard
          </a>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="mt-8 pt-8 border-t border-gray-800">
        <!-- Logo and Social Icons -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <!-- Logo -->
          <div class="mb-6 md:mb-0">
            <div class="flex items-center gap-3 mb-2">
              <!-- Blue Bolt SVG -->
              <svg class="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span class="text-white text-xl font-bold">ContentRich</span>
            </div>
            <p class="text-gray-500 text-sm">AI-powered social media management</p>
          </div>

          <!-- Social Icons -->
          <div class="flex items-center gap-4">
            <!-- Facebook -->
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition">
              <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            <!-- X (Twitter) -->
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition">
              <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.677L2.306 21.75H-.012l7.644-8.746L.424 2.25h6.679l4.875 6.434 5.277-6.434zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <!-- Instagram -->
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition">
              <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25zm3.5 4.25a.75.75 0 100-1.5.75.75 0 000 1.5zm-6 1.25c2.761 0 5 2.239 5 5s-2.239 5-5 5-5-2.239-5-5 2.239-5 5-5zm0 1.5c-1.933 0-3.5 1.567-3.5 3.5s1.567 3.5 3.5 3.5 3.5-1.567 3.5-3.5-1.567-3.5-3.5-3.5z" />
              </svg>
            </a>

            <!-- LinkedIn -->
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition">
              <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
            </a>

            <!-- YouTube -->
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition">
              <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            <!-- TikTok -->
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition">
              <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.88 2.88 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-3.47v-3.29a8.5 8.5 0 0 0 3.77 1.23v-3.16a4.9 4.9 0 0 1-.54-.05z" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Footer Bottom Links -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-wrap">
          <p class="text-gray-500 text-sm">
            © 2024 ContentRich. All rights reserved.
          </p>
          <div class="flex gap-4 text-gray-500 text-sm">
            <a href="#" class="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="#" class="hover:text-gray-300 transition-colors">Terms of Service</a>
            <span>·</span>
            <a href="#" class="hover:text-gray-300 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component setup
</script>

<style scoped>
/* Smooth transitions for hover states */
a {
  @apply transition-colors duration-200;
}
</style>
