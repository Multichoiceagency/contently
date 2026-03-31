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
  ChevronDownIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const { logout, user } = useAuth()

const collapsed = ref(false)

const navItems = [
  { label: 'Dashboard', icon: HomeIcon, to: '/dashboard' },
  { label: 'Calendar', icon: CalendarIcon, to: '/calendar' },
  { label: 'Posts', icon: DocumentTextIcon, to: '/posts' },
  { label: 'AI Generator', icon: SparklesIcon, to: '/ai' },
  { label: 'Inbox', icon: InboxIcon, to: '/inbox' },
  { label: 'Analytics', icon: ChartBarIcon, to: '/analytics' },
  { label: 'Social Accounts', icon: ShareIcon, to: '/social' },
  { label: 'Settings', icon: CogIcon, to: '/settings' },
]

const isActive = (path: string) => {
  if (path === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(path)
}
</script>

<template>
  <aside
    class="fixed left-0 top-0 h-screen bg-sidebar-bg flex flex-col z-40 transition-all duration-300"
    :class="collapsed ? 'w-[72px]' : 'w-[260px]'"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3 px-5 h-16 border-b border-white/5">
      <div class="flex-shrink-0 w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
        <span class="text-white font-bold text-sm">F</span>
      </div>
      <span
        v-if="!collapsed"
        class="text-white font-bold text-lg tracking-tight"
      >
        Flowgent
      </span>
    </div>

    <!-- Workspace Selector -->
    <div v-if="!collapsed" class="px-3 py-3">
      <WorkspaceSelector />
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
        :class="
          isActive(item.to)
            ? 'bg-sidebar-active text-sidebar-text-active'
            : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active'
        "
      >
        <component
          :is="item.icon"
          class="w-5 h-5 flex-shrink-0"
        />
        <span v-if="!collapsed">{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- User Profile -->
    <div class="border-t border-white/5 p-3">
      <div
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-text hover:bg-sidebar-hover transition-all duration-200"
      >
        <div class="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
          <span class="text-white text-xs font-semibold">
            {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
          </span>
        </div>
        <div v-if="!collapsed" class="flex-1 min-w-0">
          <p class="text-sm font-medium text-sidebar-text-active truncate">
            {{ user?.name || 'User' }}
          </p>
          <p class="text-xs text-sidebar-text truncate">
            {{ user?.email || 'user@example.com' }}
          </p>
        </div>
        <button
          v-if="!collapsed"
          class="text-sidebar-text hover:text-red-400 transition-colors"
          title="Logout"
          @click="logout"
        >
          <ArrowRightOnRectangleIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </aside>
</template>
