<script setup lang="ts">
import {
  BellIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  HomeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  SparklesIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const { restoreSession } = useAuth()

const notificationsOpen = ref(false)
const commandPaletteOpen = ref(false)

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    commandPaletteOpen.value = !commandPaletteOpen.value
  }
  if (e.key === 'Escape') {
    commandPaletteOpen.value = false
    notificationsOpen.value = false
  }
}

const { loadWorkspaces, needsOnboarding } = useWorkspace()

onMounted(async () => {
  await restoreSession()
  await loadWorkspaces()
  window.addEventListener('keydown', handleKeydown)

  // Redirect to onboarding if no workspaces and not already there
  const currentRoute = useRoute()
  if (needsOnboarding.value && currentRoute.path !== '/onboarding') {
    useRouter().push('/onboarding')
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// Close dropdowns on click outside
const handleClickOutside = () => {
  notificationsOpen.value = false
}

// Breadcrumb generation from route
const breadcrumbs = computed(() => {
  const crumbs: { label: string; to?: string }[] = []
  const path = route.path

  const routeLabels: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/calendar': 'Calendar',
    '/posts': 'Publish',
    '/ai': 'AI Studio',
    '/inbox': 'Engage',
    '/analytics': 'Analyze',
    '/social': 'Social Accounts',
    '/settings': 'Settings',
    '/discover': 'Discover',
    '/media': 'Media Library',
    '/clients': 'Clients',
    '/approvals': 'Approvals',
    '/competitors': 'Competitors',
    '/onboarding': 'Getting Started',
  }

  if (path !== '/dashboard') {
    crumbs.push({ label: 'Home', to: '/dashboard' })
  }

  const label = routeLabels[path]
  if (label) {
    crumbs.push({ label })
  }

  return crumbs
})

// Mock notifications
const notifications = ref([
  {
    id: '1',
    type: 'success',
    title: 'Post published',
    message: 'Your LinkedIn post has been published successfully.',
    time: '2 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'info',
    title: 'AI suggestion ready',
    message: 'New content suggestions are available for your review.',
    time: '15 min ago',
    read: false,
  },
  {
    id: '3',
    type: 'warning',
    title: 'Token expiring',
    message: 'Your Facebook connection will expire in 3 days.',
    time: '1 hour ago',
    read: true,
  },
  {
    id: '4',
    type: 'success',
    title: 'New follower milestone',
    message: 'Congratulations! You hit 15K followers on Instagram.',
    time: '3 hours ago',
    read: true,
  },
])

const unreadNotificationCount = computed(() => notifications.value.filter(n => !n.read).length)

const notificationIcon = (type: string) => {
  switch (type) {
    case 'success': return CheckCircleIcon
    case 'warning': return ExclamationTriangleIcon
    case 'info': return InformationCircleIcon
    default: return BellIcon
  }
}

const notificationColor = (type: string) => {
  switch (type) {
    case 'success': return 'text-emerald-500 bg-emerald-50'
    case 'warning': return 'text-amber-500 bg-amber-50'
    case 'info': return 'text-indigo-500 bg-indigo-50'
    default: return 'text-gray-500 bg-gray-50'
  }
}

const markAllRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const markAsRead = (id: string) => {
  const n = notifications.value.find(n => n.id === id)
  if (n) n.read = true
}

// Command palette search
const paletteQuery = ref('')
const palettePages = [
  { label: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  { label: 'AI Generator', to: '/ai', icon: SparklesIcon },
  { label: 'Analytics', to: '/analytics' },
  { label: 'Social Accounts', to: '/social' },
  { label: 'Inbox', to: '/inbox' },
  { label: 'Settings', to: '/settings' },
  { label: 'Calendar', to: '/calendar' },
  { label: 'Posts', to: '/posts' },
]

const filteredPalettePages = computed(() => {
  if (!paletteQuery.value.trim()) return palettePages
  const q = paletteQuery.value.toLowerCase()
  return palettePages.filter(p => p.label.toLowerCase().includes(q))
})

const navigateTo = (to: string) => {
  commandPaletteOpen.value = false
  paletteQuery.value = ''
  useRouter().push(to)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50/80">
    <AppSidebar />
    <div class="transition-all duration-300 lg:ml-[260px]">
      <!-- Enhanced Top Bar Area -->
      <div class="sticky top-0 z-20">
        <!-- Breadcrumbs + Quick Actions Bar -->
        <div v-if="breadcrumbs.length > 1" class="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-2 flex items-center justify-between">
          <nav class="flex items-center gap-1 text-xs">
            <template v-for="(crumb, idx) in breadcrumbs" :key="idx">
              <NuxtLink
                v-if="crumb.to"
                :to="crumb.to"
                class="text-gray-400 hover:text-indigo-600 transition-colors font-medium"
              >
                <HomeIcon v-if="idx === 0" class="w-3.5 h-3.5" />
                <span v-else>{{ crumb.label }}</span>
              </NuxtLink>
              <span v-else class="text-gray-700 font-semibold">{{ crumb.label }}</span>
              <ChevronRightIcon v-if="idx < breadcrumbs.length - 1" class="w-3 h-3 text-gray-300" />
            </template>
          </nav>

          <div class="flex items-center gap-2">
            <!-- Command Palette Trigger -->
            <button
              class="flex items-center gap-2 px-3 py-1 text-xs text-gray-400 bg-gray-100 hover:bg-gray-200 rounded-md transition-all duration-200"
              @click="commandPaletteOpen = true"
            >
              <MagnifyingGlassIcon class="w-3 h-3" />
              <span>Search...</span>
              <kbd class="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-gray-400 bg-white border border-gray-200 rounded">
                <span class="text-[10px]">&#8984;</span>K
              </kbd>
            </button>

            <!-- Notification Bell -->
            <div class="relative">
              <button
                class="relative p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200"
                @click.stop="notificationsOpen = !notificationsOpen"
              >
                <BellIcon class="w-4 h-4" />
                <span
                  v-if="unreadNotificationCount > 0"
                  class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                >
                  {{ unreadNotificationCount }}
                </span>
              </button>

              <!-- Notification Dropdown -->
              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 translate-y-1 scale-95"
                enter-to-class="opacity-100 translate-y-0 scale-100"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 translate-y-0 scale-100"
                leave-to-class="opacity-0 translate-y-1 scale-95"
              >
                <div
                  v-if="notificationsOpen"
                  class="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <h4 class="text-sm font-semibold text-gray-900">Notifications</h4>
                    <button
                      v-if="unreadNotificationCount > 0"
                      class="text-[11px] text-indigo-600 hover:text-indigo-700 font-medium"
                      @click="markAllRead"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div class="max-h-80 overflow-y-auto">
                    <div
                      v-for="notification in notifications"
                      :key="notification.id"
                      class="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-all duration-200 cursor-pointer border-b border-gray-50"
                      :class="{ 'bg-indigo-50/30': !notification.read }"
                      @click="markAsRead(notification.id)"
                    >
                      <div
                        class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        :class="notificationColor(notification.type)"
                      >
                        <component :is="notificationIcon(notification.type)" class="w-4 h-4" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                          <p class="text-xs font-semibold text-gray-900">{{ notification.title }}</p>
                          <div v-if="!notification.read" class="w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0" />
                        </div>
                        <p class="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{{ notification.message }}</p>
                        <p class="text-[10px] text-gray-400 mt-1">{{ notification.time }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="px-4 py-2.5 border-t border-gray-100 text-center">
                    <button class="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>

      <!-- Page Content with Transitions -->
      <div class="page-transition">
        <slot />
      </div>
    </div>

    <!-- Command Palette Overlay -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="commandPaletteOpen"
          class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh]"
          @click.self="commandPaletteOpen = false"
        >
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div
              v-if="commandPaletteOpen"
              class="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            >
              <!-- Search Input -->
              <div class="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  v-model="paletteQuery"
                  type="text"
                  placeholder="Search pages, actions..."
                  class="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none"
                  autofocus
                />
                <kbd class="px-2 py-0.5 text-[10px] font-mono font-semibold text-gray-400 bg-gray-100 border border-gray-200 rounded">
                  ESC
                </kbd>
              </div>

              <!-- Results -->
              <div class="max-h-72 overflow-y-auto py-2">
                <div class="px-3 py-1.5">
                  <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2">Pages</p>
                </div>
                <button
                  v-for="page in filteredPalettePages"
                  :key="page.to"
                  class="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-150"
                  @click="navigateTo(page.to)"
                >
                  <component v-if="page.icon" :is="page.icon" class="w-4 h-4 text-gray-400" />
                  <div v-else class="w-4 h-4 rounded bg-gray-200 flex items-center justify-center">
                    <span class="text-[8px] font-bold text-gray-500">{{ page.label.charAt(0) }}</span>
                  </div>
                  {{ page.label }}
                </button>
                <div v-if="filteredPalettePages.length === 0" class="px-5 py-8 text-center">
                  <p class="text-sm text-gray-500">No results found</p>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Click outside handler for notifications -->
    <div
      v-if="notificationsOpen"
      class="fixed inset-0 z-10"
      @click="handleClickOutside"
    />

    <Toast />
  </div>
</template>

<style scoped>
.page-transition {
  animation: fadeSlideIn 0.3s ease-out;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
