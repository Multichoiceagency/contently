<script setup lang="ts">
import {
  HomeIcon,
  CalendarIcon,
  DocumentTextIcon,
  SparklesIcon,
  InboxIcon,
  ChartBarIcon,
  ShareIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  BoltIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const { logout, user } = useAuth()

const collapsed = ref(false)

const navItems = [
  { label: 'Dashboard', icon: HomeIcon, to: '/dashboard', badge: false },
  { label: 'Calendar', icon: CalendarIcon, to: '/calendar', badge: false },
  { label: 'Posts', icon: DocumentTextIcon, to: '/posts', badge: false },
  { label: 'AI Generator', icon: SparklesIcon, to: '/ai', badge: false },
  { label: 'Inbox', icon: InboxIcon, to: '/inbox', badge: true },
  { label: 'Analytics', icon: ChartBarIcon, to: '/analytics', badge: false },
  { label: 'Social Accounts', icon: ShareIcon, to: '/social', badge: false },
  { label: 'Settings', icon: CogIcon, to: '/settings', badge: false },
]

const isActive = (path: string) => {
  if (path === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(path)
}

const userInitials = computed(() => {
  const name = user.value?.name || 'User'
  const parts = name.split(' ')
  if (parts.length >= 2) return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
  return name.charAt(0).toUpperCase()
})

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <aside
    class="fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col z-40 transition-all duration-300 ease-in-out"
    :class="collapsed ? 'w-[72px]' : 'w-[260px]'"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3 px-5 h-16 border-b border-white/5">
      <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
        <BoltIcon class="w-4.5 h-4.5 text-white" />
      </div>
      <span
        v-if="!collapsed"
        class="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
      >
        Flowgent
      </span>
    </div>

    <!-- Workspace Selector -->
    <div v-if="!collapsed" class="px-3 py-3">
      <WorkspaceSelector />
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
        :class="
          isActive(item.to)
            ? 'bg-slate-800/60 text-white border-l-2 border-indigo-500 ml-0 pl-[10px]'
            : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
        "
      >
        <component
          :is="item.icon"
          class="w-5 h-5 flex-shrink-0 transition-colors duration-200"
          :class="isActive(item.to) ? 'text-indigo-400' : 'text-slate-400'"
        />
        <span v-if="!collapsed">{{ item.label }}</span>

        <!-- Notification dot for Inbox -->
        <span
          v-if="item.badge"
          class="absolute w-2 h-2 bg-red-500 rounded-full"
          :class="collapsed ? 'top-1.5 right-1.5' : '-top-1 -right-1'"
        />
      </NuxtLink>
    </nav>

    <!-- Collapse Toggle -->
    <div class="px-3 py-2 border-t border-white/5">
      <button
        class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 transition-all duration-200"
        @click="toggleCollapse"
      >
        <ChevronDoubleLeftIcon v-if="!collapsed" class="w-4 h-4" />
        <ChevronDoubleRightIcon v-else class="w-4 h-4" />
        <span v-if="!collapsed" class="text-xs font-medium">Collapse</span>
      </button>
    </div>

    <!-- User Profile -->
    <div class="border-t border-white/5 p-3">
      <div
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/40 transition-all duration-200"
      >
        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 ring-2 ring-indigo-500/20">
          <span class="text-white text-xs font-semibold">
            {{ userInitials }}
          </span>
        </div>
        <div v-if="!collapsed" class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">
            {{ user?.name || 'User' }}
          </p>
          <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Admin
          </span>
        </div>
        <button
          v-if="!collapsed"
          class="text-slate-500 hover:text-red-400 transition-colors duration-200"
          title="Logout"
          @click="logout"
        >
          <ArrowRightOnRectangleIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </aside>
</template>
