<script setup lang="ts">
import {
  PlusIcon,
  ArrowPathIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  LinkIcon,
} from '@heroicons/vue/24/outline'
import type { SocialAccount, Platform } from '~/types'

const { addToast } = useToast()

const accounts = ref<SocialAccount[]>([
  {
    id: '1',
    platform: 'linkedin',
    accountName: 'Flowgent HQ',
    accountId: 'flowgent-hq',
    status: 'connected',
    lastSyncedAt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: '2',
    platform: 'facebook',
    accountName: 'Flowgent',
    accountId: 'flowgent',
    status: 'connected',
    lastSyncedAt: new Date(Date.now() - 7200000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
  },
  {
    id: '3',
    platform: 'twitter',
    accountName: '@flowgent',
    accountId: 'flowgent',
    status: 'error',
    lastSyncedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: '4',
    platform: 'instagram',
    accountName: '@flowgent.io',
    accountId: 'flowgent.io',
    status: 'connected',
    lastSyncedAt: new Date(Date.now() - 1800000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
])

const availablePlatforms: { id: Platform; label: string; description: string }[] = [
  { id: 'linkedin', label: 'LinkedIn', description: 'Connect your LinkedIn company page or personal profile' },
  { id: 'facebook', label: 'Facebook', description: 'Connect your Facebook page to publish posts' },
  { id: 'twitter', label: 'Twitter/X', description: 'Connect your Twitter account to tweet automatically' },
  { id: 'instagram', label: 'Instagram', description: 'Connect your Instagram business account' },
]

const statusConfig: Record<string, { label: string; icon: any; color: string; textColor: string }> = {
  connected: {
    label: 'Connected',
    icon: CheckCircleIcon,
    color: 'bg-green-100',
    textColor: 'text-green-700',
  },
  disconnected: {
    label: 'Disconnected',
    icon: XMarkIcon,
    color: 'bg-gray-100',
    textColor: 'text-gray-600',
  },
  error: {
    label: 'Error',
    icon: ExclamationCircleIcon,
    color: 'bg-red-100',
    textColor: 'text-red-700',
  },
}

const disconnect = (id: string) => {
  const account = accounts.value.find(a => a.id === id)
  if (account) {
    account.status = 'disconnected'
    addToast(`${account.accountName} has been disconnected`, 'info')
  }
}

const reconnect = (id: string) => {
  const account = accounts.value.find(a => a.id === id)
  if (account) {
    account.status = 'connected'
    account.lastSyncedAt = new Date().toISOString()
    addToast(`${account.accountName} has been reconnected`, 'success')
  }
}

const connectNew = (platform: Platform) => {
  addToast(`Opening ${platform} authorization...`, 'info')
  // In production, this would redirect to OAuth
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
</script>

<template>
  <div>
    <AppTopbar title="Social Accounts" subtitle="Manage your connected social media accounts.">
      <template #action>
        <span />
      </template>
    </AppTopbar>

    <div class="p-6 space-y-6">
      <!-- Connected Accounts -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-4">Connected Accounts</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="account in accounts"
            :key="account.id"
            class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <PlatformIcon :platform="account.platform" size="lg" />
                <div>
                  <h4 class="text-sm font-semibold text-gray-900">{{ account.accountName }}</h4>
                  <p class="text-xs text-gray-500 capitalize">{{ account.platform }}</p>
                </div>
              </div>
              <div
                :class="[statusConfig[account.status].color, statusConfig[account.status].textColor]"
                class="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
              >
                <component :is="statusConfig[account.status].icon" class="w-3.5 h-3.5" />
                {{ statusConfig[account.status].label }}
              </div>
            </div>

            <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div class="flex items-center gap-1 text-xs text-gray-400">
                <ArrowPathIcon class="w-3.5 h-3.5" />
                <span>Synced {{ formatSyncTime(account.lastSyncedAt) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <button
                  v-if="account.status === 'error' || account.status === 'disconnected'"
                  class="text-xs text-brand-600 hover:text-brand-700 font-medium transition-all duration-200"
                  @click="reconnect(account.id)"
                >
                  Reconnect
                </button>
                <button
                  v-if="account.status === 'connected'"
                  class="text-xs text-red-500 hover:text-red-600 font-medium transition-all duration-200"
                  @click="disconnect(account.id)"
                >
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            v-for="platform in availablePlatforms"
            :key="platform.id"
            class="flex items-center gap-4 bg-white rounded-xl border-2 border-dashed border-gray-200 p-5 hover:border-brand-300 hover:bg-brand-50/30 transition-all duration-200 text-left group"
            @click="connectNew(platform.id)"
          >
            <PlatformIcon :platform="platform.id" size="lg" />
            <div class="flex-1">
              <h4 class="text-sm font-semibold text-gray-900 group-hover:text-brand-700">{{ platform.label }}</h4>
              <p class="text-xs text-gray-500 mt-0.5">{{ platform.description }}</p>
            </div>
            <LinkIcon class="w-5 h-5 text-gray-300 group-hover:text-brand-400 transition-all duration-200" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
