<template>
  <nav class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100" @mouseleave="closeDropdownsOnDelay">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2 flex-shrink-0">
          <div class="w-6 h-6 text-cs-blue">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-full h-full"
            >
              <path
                d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
              />
            </svg>
          </div>
          <span class="text-cs-heading font-bold text-xl">ContentRich</span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <!-- Product Dropdown -->
          <div
            class="relative"
            @mouseenter="openDropdown('product')"
            @mouseleave="scheduleCloseDropdown"
          >
            <button class="flex items-center space-x-1 text-cs-body font-medium text-sm hover:text-cs-blue transition-colors">
              <span>Product</span>
              <ChevronDownIcon class="w-4 h-4" />
            </button>

            <!-- Product Mega Dropdown -->
            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <div
                v-if="activeDropdown === 'product'"
                class="absolute top-full left-0 mt-0 w-max bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50"
                @mouseenter="cancelCloseDropdown"
                @mouseleave="scheduleCloseDropdown"
              >
                <div class="grid grid-cols-2 gap-8">
                  <!-- Core Features Column -->
                  <div>
                    <h3 class="text-xs font-bold text-cs-heading uppercase tracking-wider mb-4">Core Features</h3>
                    <div class="space-y-3">
                      <!-- Publish -->
                      <NuxtLink
                        to="/publish"
                        class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <CalendarIcon class="w-5 h-5 text-cs-blue" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-sm font-semibold text-cs-heading group-hover:text-cs-blue transition-colors">Publish</p>
                          <p class="text-xs text-cs-muted">Plan and schedule content</p>
                        </div>
                      </NuxtLink>

                      <!-- AI Studio -->
                      <NuxtLink
                        to="/ai-studio"
                        class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <SparklesIcon class="w-5 h-5 text-cs-blue" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-sm font-semibold text-cs-heading group-hover:text-cs-blue transition-colors">AI Studio</p>
                          <p class="text-xs text-cs-muted">AI-generated captions & images</p>
                        </div>
                      </NuxtLink>

                      <!-- Analyze -->
                      <NuxtLink
                        to="/analyze"
                        class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <ChartBarIcon class="w-5 h-5 text-cs-blue" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-sm font-semibold text-cs-heading group-hover:text-cs-blue transition-colors">Analyze</p>
                          <p class="text-xs text-cs-muted">Track social media performance</p>
                        </div>
                      </NuxtLink>

                      <!-- Engage -->
                      <NuxtLink
                        to="/engage"
                        class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <ChatBubbleLeftRightIcon class="w-5 h-5 text-cs-blue" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-sm font-semibold text-cs-heading group-hover:text-cs-blue transition-colors">Engage</p>
                          <p class="text-xs text-cs-muted">Social inbox & DM management</p>
                        </div>
                      </NuxtLink>

                      <!-- Discover -->
                      <NuxtLink
                        to="/discover"
                        class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <MagnifyingGlassIcon class="w-5 h-5 text-cs-blue" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-sm font-semibold text-cs-heading group-hover:text-cs-blue transition-colors">Discover</p>
                          <p class="text-xs text-cs-muted">Find trending content</p>
                        </div>
                      </NuxtLink>
                    </div>
                  </div>

                  <!-- Tools Column -->
                  <div>
                    <h3 class="text-xs font-bold text-cs-heading uppercase tracking-wider mb-4">Tools</h3>
                    <div class="space-y-3">
                      <!-- Content Calendar -->
                      <NuxtLink
                        to="/publish"
                        class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <CalendarDaysIcon class="w-5 h-5 text-cs-blue" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-sm font-semibold text-cs-heading group-hover:text-cs-blue transition-colors">Content Calendar</p>
                          <p class="text-xs text-cs-muted">Visual content planner</p>
                        </div>
                      </NuxtLink>

                      <!-- Media Library -->
                      <NuxtLink
                        to="/publish"
                        class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <PhotoIcon class="w-5 h-5 text-cs-blue" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-sm font-semibold text-cs-heading group-hover:text-cs-blue transition-colors">Media Library</p>
                          <p class="text-xs text-cs-muted">Organize your digital assets</p>
                        </div>
                      </NuxtLink>

                      <!-- AI Content Library -->
                      <NuxtLink
                        to="/ai-studio"
                        class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <DocumentTextIcon class="w-5 h-5 text-cs-blue" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-sm font-semibold text-cs-heading group-hover:text-cs-blue transition-colors">AI Content Library</p>
                          <p class="text-xs text-cs-muted">Save & reuse AI content</p>
                        </div>
                      </NuxtLink>

                      <!-- Bulk Scheduling -->
                      <NuxtLink
                        to="/publish"
                        class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <ClockIcon class="w-5 h-5 text-cs-blue" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-sm font-semibold text-cs-heading group-hover:text-cs-blue transition-colors">Bulk Scheduling</p>
                          <p class="text-xs text-cs-muted">Schedule posts in bulk</p>
                        </div>
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Solutions Dropdown -->
          <div
            class="relative"
            @mouseenter="openDropdown('solutions')"
            @mouseleave="scheduleCloseDropdown"
          >
            <button class="flex items-center space-x-1 text-cs-body font-medium text-sm hover:text-cs-blue transition-colors">
              <span>Solutions</span>
              <ChevronDownIcon class="w-4 h-4" />
            </button>

            <!-- Solutions Dropdown -->
            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <div
                v-if="activeDropdown === 'solutions'"
                class="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-max bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50"
                @mouseenter="cancelCloseDropdown"
                @mouseleave="scheduleCloseDropdown"
              >
                <div class="space-y-2 min-w-64">
                  <NuxtLink
                    to="/solutions/agencies"
                    class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <UserGroupIcon class="w-5 h-5 text-cs-blue" />
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-cs-heading group-hover:text-cs-blue transition-colors">For Agencies</p>
                      <p class="text-xs text-cs-muted">Scale your agency operations</p>
                    </div>
                  </NuxtLink>

                  <NuxtLink
                    to="/solutions/teams"
                    class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <UsersIcon class="w-5 h-5 text-cs-blue" />
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-cs-heading group-hover:text-cs-blue transition-colors">For Marketing Teams</p>
                      <p class="text-xs text-cs-muted">Collaborate and streamline workflows</p>
                    </div>
                  </NuxtLink>

                  <NuxtLink
                    to="/solutions/creators"
                    class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <UserIcon class="w-5 h-5 text-cs-blue" />
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-cs-heading group-hover:text-cs-blue transition-colors">For Solo Creators</p>
                      <p class="text-xs text-cs-muted">Grow your audience independently</p>
                    </div>
                  </NuxtLink>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Resources Link -->
          <NuxtLink
            to="#resources"
            class="text-cs-body font-medium text-sm hover:text-cs-blue transition-colors"
          >
            Resources
          </NuxtLink>

          <!-- Pricing Link -->
          <NuxtLink
            to="/pricing"
            class="text-cs-body font-medium text-sm hover:text-cs-blue transition-colors"
          >
            Pricing
          </NuxtLink>
        </div>

        <!-- Right Side: Book Demo + Sign In + CTA Button -->
        <div class="hidden md:flex items-center space-x-6">
          <NuxtLink
            to="#book-demo"
            class="text-cs-body font-medium text-sm hover:text-cs-blue transition-colors"
          >
            Book a demo
          </NuxtLink>
          <a
            :href="dashboardUrl + '/auth/login'"
            class="text-cs-body font-medium text-sm hover:text-cs-blue transition-colors"
          >
            Sign in
          </a>
          <a
            :href="dashboardUrl + '/auth/register'"
            class="bg-cs-blue text-white rounded-full px-6 py-2.5 text-sm font-medium hover:bg-cs-blue-dark transition-colors"
          >
            Start free trial
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-cs-body hover:bg-gray-100 focus:outline-none"
        >
          <Bars3Icon v-if="!mobileMenuOpen" class="w-6 h-6" />
          <XMarkIcon v-else class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-sm"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <!-- Product Expandable -->
          <div>
            <button
              @click="mobileProductOpen = !mobileProductOpen"
              class="w-full text-left px-3 py-2 rounded-md text-cs-body font-medium text-sm hover:bg-gray-50 flex items-center justify-between"
            >
              <span>Product</span>
              <ChevronDownIcon :class="['w-4 h-4', mobileProductOpen && 'rotate-180']" class="transition-transform" />
            </button>

            <!-- Mobile Product Submenu -->
            <Transition
              enter-active-class="transition ease-out duration-150"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div v-if="mobileProductOpen" class="pl-4 space-y-1">
                <NuxtLink to="/publish" class="block px-3 py-2 rounded-md text-cs-body text-sm hover:bg-gray-50">Publish</NuxtLink>
                <NuxtLink to="/ai-studio" class="block px-3 py-2 rounded-md text-cs-body text-sm hover:bg-gray-50">AI Studio</NuxtLink>
                <NuxtLink to="/analyze" class="block px-3 py-2 rounded-md text-cs-body text-sm hover:bg-gray-50">Analyze</NuxtLink>
                <NuxtLink to="/engage" class="block px-3 py-2 rounded-md text-cs-body text-sm hover:bg-gray-50">Engage</NuxtLink>
                <NuxtLink to="/discover" class="block px-3 py-2 rounded-md text-cs-body text-sm hover:bg-gray-50">Discover</NuxtLink>
                <NuxtLink to="/publish" class="block px-3 py-2 rounded-md text-cs-body text-sm hover:bg-gray-50">Content Calendar</NuxtLink>
                <NuxtLink to="/publish" class="block px-3 py-2 rounded-md text-cs-body text-sm hover:bg-gray-50">Media Library</NuxtLink>
                <NuxtLink to="/ai-studio" class="block px-3 py-2 rounded-md text-cs-body text-sm hover:bg-gray-50">AI Content Library</NuxtLink>
                <NuxtLink to="/publish" class="block px-3 py-2 rounded-md text-cs-body text-sm hover:bg-gray-50">Bulk Scheduling</NuxtLink>
              </div>
            </Transition>
          </div>

          <!-- Solutions Expandable -->
          <div>
            <button
              @click="mobileSolutionsOpen = !mobileSolutionsOpen"
              class="w-full text-left px-3 py-2 rounded-md text-cs-body font-medium text-sm hover:bg-gray-50 flex items-center justify-between"
            >
              <span>Solutions</span>
              <ChevronDownIcon :class="['w-4 h-4', mobileSolutionsOpen && 'rotate-180']" class="transition-transform" />
            </button>

            <!-- Mobile Solutions Submenu -->
            <Transition
              enter-active-class="transition ease-out duration-150"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div v-if="mobileSolutionsOpen" class="pl-4 space-y-1">
                <NuxtLink to="/solutions/agencies" class="block px-3 py-2 rounded-md text-cs-body text-sm hover:bg-gray-50">For Agencies</NuxtLink>
                <NuxtLink to="/solutions/teams" class="block px-3 py-2 rounded-md text-cs-body text-sm hover:bg-gray-50">For Marketing Teams</NuxtLink>
                <NuxtLink to="/solutions/creators" class="block px-3 py-2 rounded-md text-cs-body text-sm hover:bg-gray-50">For Solo Creators</NuxtLink>
              </div>
            </Transition>
          </div>

          <!-- Resources -->
          <NuxtLink
            to="#resources"
            class="block px-3 py-2 rounded-md text-cs-body font-medium text-sm hover:bg-gray-50"
          >
            Resources
          </NuxtLink>

          <!-- Pricing -->
          <NuxtLink
            to="/pricing"
            class="block px-3 py-2 rounded-md text-cs-body font-medium text-sm hover:bg-gray-50"
          >
            Pricing
          </NuxtLink>

          <div class="border-t border-gray-100 pt-2 mt-2">
            <!-- Book a Demo -->
            <NuxtLink
              to="#book-demo"
              class="block px-3 py-2 rounded-md text-cs-body font-medium text-sm hover:bg-gray-50"
            >
              Book a demo
            </NuxtLink>

            <!-- Sign In -->
            <a
              :href="dashboardUrl + '/auth/login'"
              class="block px-3 py-2 rounded-md text-cs-body font-medium text-sm hover:bg-gray-50"
            >
              Sign in
            </a>

            <!-- Start Free Trial Button -->
            <a
              :href="dashboardUrl + '/auth/register'"
              class="block mt-2 bg-cs-blue text-white rounded-full px-6 py-2.5 text-sm font-medium text-center hover:bg-cs-blue-dark transition-colors"
            >
              Start free trial
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ChevronDownIcon,
  CalendarIcon,
  SparklesIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  PhotoIcon,
  DocumentTextIcon,
  ClockIcon,
  UserGroupIcon,
  UsersIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

const config = useRuntimeConfig()
const dashboardUrl = computed(() => {
  if (import.meta.client) {
    const hostname = window.location.hostname
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return ''  // Same origin in dev
    }
  }
  const domain = config.public.dashboardDomain || 'dashboard.contentrich.nl'
  return `https://${domain}`
})

const mobileMenuOpen = ref(false)
const mobileProductOpen = ref(false)
const mobileSolutionsOpen = ref(false)
const activeDropdown = ref<null | 'product' | 'solutions'>(null)
let closeDropdownTimer: ReturnType<typeof setTimeout> | null = null

const openDropdown = (dropdown: 'product' | 'solutions') => {
  cancelCloseDropdown()
  activeDropdown.value = dropdown
}

const scheduleCloseDropdown = () => {
  closeDropdownTimer = setTimeout(() => {
    activeDropdown.value = null
  }, 150)
}

const cancelCloseDropdown = () => {
  if (closeDropdownTimer) {
    clearTimeout(closeDropdownTimer)
    closeDropdownTimer = null
  }
}

const closeDropdownsOnDelay = () => {
  scheduleCloseDropdown()
}
</script>

<style scoped>
/* Smooth transitions for dropdowns */
nav {
  transition: all 0.3s ease-in-out;
}
</style>
