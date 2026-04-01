<script setup lang="ts">
import {
  PlusIcon,
  ArrowPathIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  LinkIcon,
  SignalIcon,
  UserGroupIcon,
  ClockIcon,
  ShieldCheckIcon,
} from '@heroicons/vue/24/outline'
import type { SocialAccount, Platform } from '~/types'

const { addToast } = useToast()
const { token } = useAuth()
const { current } = useWorkspace()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

// Reconnect flow state
const reconnectingId = ref<string | null>(null)
const reconnectStep = ref(0)

const accounts = ref<(SocialAccount & {
  followers?: string
  profileImage?: string
  lastActive?: string
  expiresAt?: string
})[]>([])

const loadAccounts = async () => {
  if (!token.value || !current.value?.id) return
  try {
    const res = await $fetch<any>(`${apiBase}/social/accounts`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        'x-workspace-id': current.value.id,
      },
    })
    accounts.value = (res.accounts || []).map((a: any) => ({
      id: a.id,
      platform: a.platform,
      accountName: a.accountName,
      accountId: a.id,
      status: 'connected' as const,
      lastSyncedAt: a.updatedAt,
      createdAt: a.createdAt,
    }))
  } catch {
    accounts.value = []
  }
}

onMounted(() => loadAccounts())
watch(() => current.value?.id, () => loadAccounts())

const availablePlatforms: { id: Platform; label: string; description: string; color: string; bgColor: string; hoverBg: string }[] = [
  { id: 'linkedin', label: 'LinkedIn', description: 'Connect your company page or profile', color: 'text-white', bgColor: 'bg-[#0077B5]', hoverBg: 'hover:bg-[#006297]' },
  { id: 'facebook', label: 'Facebook', description: 'Connect your Facebook page', color: 'text-white', bgColor: 'bg-[#1877F2]', hoverBg: 'hover:bg-[#1466d4]' },
  { id: 'twitter', label: 'Twitter/X', description: 'Connect your Twitter account', color: 'text-white', bgColor: 'bg-[#1DA1F2]', hoverBg: 'hover:bg-[#0d8bd9]' },
  { id: 'instagram', label: 'Instagram', description: 'Connect your business account', color: 'text-white', bgColor: 'bg-[#E4405F]', hoverBg: 'hover:bg-[#d6294a]' },
]

const getEffectiveStatus = (account: typeof accounts.value[0]) => {
  if (account.status === 'error') return 'error'
  if (account.status === 'disconnected') return 'disconnected'
  if (account.expiresAt) {
    const daysUntilExpiry = (new Date(account.expiresAt).getTime() - Date.now()) / (86400000)
    if (daysUntilExpiry <= 7) return 'expiring'
  }
  return 'connected'
}

const statusConfig: Record<string, { label: string; icon: any; dotColor: string; bgColor: string; textColor: string }> = {
  connected: {
    label: 'Connected',
    icon: CheckCircleIcon,
    dotColor: 'bg-emerald-400',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
  },
  expiring: {
    label: 'Token Expiring',
    icon: ExclamationTriangleIcon,
    dotColor: 'bg-amber-400',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
  },
  disconnected: {
    label: 'Disconnected',
    icon: XMarkIcon,
    dotColor: 'bg-gray-400',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
  },
  error: {
    label: 'Error',
    icon: ExclamationCircleIcon,
    dotColor: 'bg-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
  },
}

const reconnectSteps = [
  { label: 'Authorizing', description: 'Opening platform auth...' },
  { label: 'Verifying', description: 'Verifying credentials...' },
  { label: 'Syncing', description: 'Syncing account data...' },
  { label: 'Complete', description: 'Successfully reconnected!' },
]

const disconnect = (id: string) => {
  const account = accounts.value.find(a => a.id === id)
  if (account) {
    account.status = 'disconnected'
    addToast(`${account.accountName} has been disconnected`, 'info')
  }
}

const reconnect = async (id: string) => {
  reconnectingId.value = id
  reconnectStep.value = 0

  // Simulate reconnect flow
  for (let step = 1; step <= 4; step++) {
    await new Promise(r => setTimeout(r, 800))
    reconnectStep.value = step
  }

  const account = accounts.value.find(a => a.id === id)
  if (account) {
    account.status = 'connected'
    account.lastSyncedAt = new Date().toISOString()
    delete account.expiresAt
    addToast(`${account.accountName} has been reconnected`, 'success')
  }

  await new Promise(r => setTimeout(r, 500))
  reconnectingId.value = null
  reconnectStep.value = 0
}

const connectNew = (platform: Platform) => {
  addToast(`Opening ${platform} authorization...`, 'info')
}

const formatSyncTime = (dateStr?: string) => {
  if (!dateStr) return 'Never'
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const platformBg = (platform: Platform) => {
  const map: Record<Platform, string> = {
    linkedin: 'from-[#0077B5]/5 to-[#0077B5]/0',
    facebook: 'from-[#1877F2]/5 to-[#1877F2]/0',
    twitter: 'from-[#1DA1F2]/5 to-[#1DA1F2]/0',
    instagram: 'from-[#E4405F]/5 to-[#E4405F]/0',
  }
  return map[platform]
}
</script>

<template>
  <div>
    <AppTopbar title="Social Accounts" subtitle="Manage your connected social media accounts.">
      <template #action>
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <SignalIcon class="w-4 h-4 text-emerald-500" />
          <span>{{ accounts.filter(a => a.status === 'connected').length }}/{{ accounts.length }} connected</span>
        </div>
      </template>
    </AppTopbar>

    <div class="p-6 space-y-8">
      <!-- Connected Accounts -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-gray-900">Connected Accounts</h3>
          <span class="text-xs text-gray-400">{{ accounts.length }} accounts</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
          <div
            v-for="account in accounts"
            :key="account.id"
            class="relative bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group"
          >
            <!-- Platform-colored top gradient -->
            <div class="h-1 bg-gradient-to-r" :class="platformBg(account.platform).replace('to-', 'to-transparent from-')" />

            <!-- Reconnect overlay -->
            <div
              v-if="reconnectingId === account.id"
              class="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6"
            >
              <div class="w-full max-w-xs">
                <div class="flex items-center justify-between mb-4">
                  <span class="text-sm font-semibold text-gray-900">Reconnecting...</span>
                  <span class="text-xs text-gray-400">Step {{ Math.min(reconnectStep, 4) }}/4</span>
                </div>
                <!-- Progress Steps -->
                <div class="space-y-3">
                  <div
                    v-for="(step, idx) in reconnectSteps"
                    :key="idx"
                    class="flex items-center gap-3"
                  >
                    <div
                      class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      :class="reconnectStep > idx
                        ? 'bg-emerald-500 text-white'
                        : reconnectStep === idx + 1
                          ? 'bg-indigo-500 text-white animate-pulse'
                          : 'bg-gray-200 text-gray-400'"
                    >
                      <CheckCircleIcon v-if="reconnectStep > idx" class="w-4 h-4" />
                      <span v-else class="text-[10px] font-bold">{{ idx + 1 }}</span>
                    </div>
                    <div class="flex-1">
                      <p class="text-xs font-medium" :class="reconnectStep >= idx + 1 ? 'text-gray-900' : 'text-gray-400'">
                        {{ step.label }}
                      </p>
                      <p class="text-[10px]" :class="reconnectStep >= idx + 1 ? 'text-gray-500' : 'text-gray-300'">
                        {{ step.description }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-5">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <!-- Profile picture / Platform avatar -->
                  <div class="relative">
                    <PlatformIcon :platform="account.platform" size="lg" />
                    <!-- Status dot -->
                    <div
                      class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white"
                      :class="statusConfig[getEffectiveStatus(account)].dotColor"
                    />
                  </div>
                  <div>
                    <h4 class="text-sm font-semibold text-gray-900">{{ account.accountName }}</h4>
                    <p class="text-xs text-gray-500 capitalize">{{ account.platform }}</p>
                  </div>
                </div>
                <div
                  :class="[statusConfig[getEffectiveStatus(account)].bgColor, statusConfig[getEffectiveStatus(account)].textColor]"
                  class="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                >
                  <component :is="statusConfig[getEffectiveStatus(account)].icon" class="w-3.5 h-3.5" />
                  {{ statusConfig[getEffectiveStatus(account)].label }}
                </div>
              </div>

              <!-- Stats Row -->
              <div class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div class="text-center">
                  <div class="flex items-center justify-center gap-1 mb-0.5">
                    <UserGroupIcon class="w-3 h-3 text-gray-400" />
                  </div>
                  <p class="text-sm font-bold text-gray-900">{{ account.followers || '--' }}</p>
                  <p class="text-[10px] text-gray-400">Followers</p>
                </div>
                <div class="text-center">
                  <div class="flex items-center justify-center gap-1 mb-0.5">
                    <ClockIcon class="w-3 h-3 text-gray-400" />
                  </div>
                  <p class="text-xs font-semibold text-gray-700">{{ account.lastActive || '--' }}</p>
                  <p class="text-[10px] text-gray-400">Last Active</p>
                </div>
                <div class="text-center">
                  <div class="flex items-center justify-center gap-1 mb-0.5">
                    <ArrowPathIcon class="w-3 h-3 text-gray-400" />
                  </div>
                  <p class="text-xs font-semibold text-gray-700">{{ formatSyncTime(account.lastSyncedAt) }}</p>
                  <p class="text-[10px] text-gray-400">Last Sync</p>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center justify-end mt-4 pt-3 border-t border-gray-100 gap-2">
                <button
                  v-if="getEffectiveStatus(account) === 'error' || getEffectiveStatus(account) === 'disconnected' || getEffectiveStatus(account) === 'expiring'"
                  class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all duration-200"
                  @click="reconnect(account.id)"
                >
                  <ArrowPathIcon class="w-3.5 h-3.5" />
                  Reconnect
                </button>
                <button
                  v-if="account.status === 'connected'"
                  class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                  @click="disconnect(account.id)"
                >
                  <XMarkIcon class="w-3.5 h-3.5" />
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Connect New Account -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-4">Connect New Account</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            v-for="platform in availablePlatforms"
            :key="platform.id"
            class="flex flex-col items-center gap-3 rounded-xl p-6 transition-all duration-200 text-center group border-2 border-dashed border-gray-200 hover:border-transparent hover:shadow-lg bg-white"
            @click="connectNew(platform.id)"
          >
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg"
              :class="platform.bgColor"
            >
              <PlatformIcon :platform="platform.id" size="lg" />
            </div>
            <div>
              <h4 class="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{{ platform.label }}</h4>
              <p class="text-[11px] text-gray-500 mt-0.5">{{ platform.description }}</p>
            </div>
            <div
              class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
              :class="[platform.bgColor, platform.color, platform.hoverBg]"
            >
              <PlusIcon class="w-3.5 h-3.5" />
              Connect
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
