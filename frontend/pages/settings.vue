<script setup lang="ts">
import {
  UserCircleIcon,
  BuildingOfficeIcon,
  UsersIcon,
  CreditCardIcon,
  BellIcon,
  CameraIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  StarIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import type { TeamMember } from '~/types'

const { user } = useAuth()
const { addToast } = useToast()

const activeTab = ref('profile')

const tabs = [
  { id: 'profile', label: 'Profile', icon: UserCircleIcon },
  { id: 'workspace', label: 'Workspace', icon: BuildingOfficeIcon },
  { id: 'team', label: 'Team', icon: UsersIcon },
  { id: 'billing', label: 'Billing', icon: CreditCardIcon },
  { id: 'notifications', label: 'Notifications', icon: BellIcon },
]

// Profile
const profileName = ref(user.value?.name || 'John Doe')
const profileEmail = ref(user.value?.email || 'john@example.com')
const profileBio = ref('Social media strategist passionate about AI-powered content.')
const savingProfile = ref(false)
const avatarHovered = ref(false)

const saveProfile = async () => {
  savingProfile.value = true
  await new Promise(r => setTimeout(r, 500))
  savingProfile.value = false
  addToast('Profile updated successfully', 'success')
}

// Workspace
const workspaceName = ref('My Brand')
const workspaceSlug = ref('my-brand')
const savingWorkspace = ref(false)

const saveWorkspace = async () => {
  savingWorkspace.value = true
  await new Promise(r => setTimeout(r, 500))
  savingWorkspace.value = false
  addToast('Workspace updated successfully', 'success')
}

// Team
const teamMembers = ref<TeamMember[]>([
  { id: '1', userId: '1', name: 'John Doe', email: 'john@example.com', role: 'owner', joinedAt: new Date().toISOString() },
  { id: '2', userId: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'admin', joinedAt: new Date(Date.now() - 86400000 * 14).toISOString() },
  { id: '3', userId: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'editor', joinedAt: new Date(Date.now() - 86400000 * 7).toISOString() },
])

const inviteEmail = ref('')
const inviteRole = ref('editor')
const emailChips = ref<string[]>([])

const addEmailChip = () => {
  const email = inviteEmail.value.trim()
  if (email && email.includes('@') && !emailChips.value.includes(email)) {
    emailChips.value.push(email)
    inviteEmail.value = ''
  }
}

const removeEmailChip = (email: string) => {
  emailChips.value = emailChips.value.filter(e => e !== email)
}

const inviteMembers = () => {
  const emails = emailChips.value.length > 0 ? emailChips.value : inviteEmail.value ? [inviteEmail.value] : []
  if (emails.length === 0) return

  emails.forEach(email => {
    teamMembers.value.push({
      id: Date.now().toString() + Math.random(),
      userId: Date.now().toString(),
      name: email.split('@')[0],
      email,
      role: inviteRole.value as any,
      joinedAt: new Date().toISOString(),
    })
  })

  addToast(`Invitation sent to ${emails.length} member(s)`, 'success')
  emailChips.value = []
  inviteEmail.value = ''
}

const removeMember = (id: string) => {
  teamMembers.value = teamMembers.value.filter(m => m.id !== id)
  addToast('Team member removed', 'success')
}

const roleConfig: Record<string, { bg: string; text: string; icon?: any }> = {
  owner: { bg: 'bg-purple-100', text: 'text-purple-700', icon: StarIcon },
  admin: { bg: 'bg-blue-100', text: 'text-blue-700', icon: ShieldCheckIcon },
  editor: { bg: 'bg-gray-100', text: 'text-gray-700' },
  viewer: { bg: 'bg-gray-50', text: 'text-gray-500' },
}

// Billing
const currentPlan = ref('pro')
const plans = [
  {
    id: 'free',
    label: 'Free',
    price: '$0',
    description: 'Perfect for trying things out',
    popular: false,
    features: ['3 social accounts', '30 posts/month', 'Basic analytics', 'Email support'],
    notIncluded: ['AI generator', 'Team collaboration', 'API access'],
  },
  {
    id: 'pro',
    label: 'Pro',
    price: '$29',
    description: 'Best for growing teams',
    popular: true,
    features: ['10 social accounts', 'Unlimited posts', 'AI generator', 'Advanced analytics', 'Team collaboration', 'Priority support'],
    notIncluded: ['API access', 'Custom reports'],
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    price: '$99',
    description: 'For large organizations',
    popular: false,
    features: ['Unlimited accounts', 'Unlimited posts', 'Priority AI', 'Custom reports', 'API access', 'Dedicated support', 'SSO & SAML', 'Custom integrations'],
    notIncluded: [],
  },
]

// Notifications
const notificationSettings = ref({
  emailNewPost: true,
  emailPostPublished: true,
  emailWeeklyReport: true,
  emailTeamActivity: false,
  emailAiSuggestions: true,
  emailBilling: true,
})

const notificationItems = [
  { key: 'emailNewPost' as const, title: 'New post created', desc: 'Get notified when a team member creates a new post' },
  { key: 'emailPostPublished' as const, title: 'Post published', desc: 'Get notified when a scheduled post is published' },
  { key: 'emailWeeklyReport' as const, title: 'Weekly report', desc: 'Receive a weekly performance summary' },
  { key: 'emailTeamActivity' as const, title: 'Team activity', desc: 'Get notified about team member actions' },
  { key: 'emailAiSuggestions' as const, title: 'AI Suggestions', desc: 'Receive AI-powered content recommendations' },
  { key: 'emailBilling' as const, title: 'Billing notifications', desc: 'Get notified about invoices and payment status' },
]
</script>

<template>
  <div>
    <AppTopbar title="Settings" subtitle="Manage your account and workspace preferences.">
      <template #action><span /></template>
    </AppTopbar>

    <div class="p-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Sidebar Tabs: vertical on desktop, horizontal scroll on mobile -->
        <div class="lg:w-56 flex-shrink-0">
          <!-- Mobile: horizontal scrollable -->
          <div class="lg:hidden flex gap-1 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200"
              :class="
                activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              "
              @click="activeTab = tab.id"
            >
              <component :is="tab.icon" class="w-4 h-4" />
              {{ tab.label }}
            </button>
          </div>

          <!-- Desktop: vertical sidebar -->
          <nav class="hidden lg:block space-y-1 sticky top-24">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
              :class="
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm border border-indigo-100'
                  : 'text-gray-600 hover:bg-gray-50'
              "
              @click="activeTab = tab.id"
            >
              <component
                :is="tab.icon"
                class="w-5 h-5"
                :class="activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'"
              />
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- Content -->
        <div class="flex-1 max-w-3xl">
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
            mode="out-in"
          >
            <!-- Profile Tab -->
            <div v-if="activeTab === 'profile'" key="profile" class="space-y-6">
              <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 class="text-base font-semibold text-gray-900">Profile Settings</h3>
                  <p class="text-xs text-gray-500 mt-0.5">Update your personal information</p>
                </div>

                <div class="p-6">
                  <!-- Avatar with crop preview hover -->
                  <div class="flex items-center gap-5 mb-8">
                    <div
                      class="relative w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center cursor-pointer group ring-4 ring-indigo-50"
                      @mouseenter="avatarHovered = true"
                      @mouseleave="avatarHovered = false"
                    >
                      <span class="text-3xl font-bold text-white">{{ profileName.charAt(0).toUpperCase() }}</span>
                      <div
                        class="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center transition-opacity duration-200"
                        :class="avatarHovered ? 'opacity-100' : 'opacity-0'"
                      >
                        <CameraIcon class="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <button class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200">
                        <CameraIcon class="w-4 h-4" />
                        Upload Photo
                      </button>
                      <p class="text-[11px] text-gray-400 mt-1.5">JPG, PNG. Max 2MB. Recommended 256x256px.</p>
                    </div>
                  </div>

                  <div class="space-y-5">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                        <input
                          v-model="profileName"
                          type="text"
                          class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                        <input
                          v-model="profileEmail"
                          type="email"
                          class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bio</label>
                      <textarea
                        v-model="profileBio"
                        rows="3"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all duration-200 resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div class="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                  <button
                    class="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 shadow-sm"
                    :disabled="savingProfile"
                    @click="saveProfile"
                  >
                    <LoadingSpinner v-if="savingProfile" size="sm" />
                    <span v-else>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Workspace Tab -->
            <div v-else-if="activeTab === 'workspace'" key="workspace" class="space-y-6">
              <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 class="text-base font-semibold text-gray-900">Workspace Settings</h3>
                  <p class="text-xs text-gray-500 mt-0.5">Customize your workspace appearance and URL</p>
                </div>

                <div class="p-6">
                  <div class="flex items-center gap-5 mb-8">
                    <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <span class="text-3xl font-bold text-white">{{ workspaceName.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div>
                      <button class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200">
                        <CameraIcon class="w-4 h-4" />
                        Change Logo
                      </button>
                      <p class="text-[11px] text-gray-400 mt-1.5">Square image, min 128x128px.</p>
                    </div>
                  </div>

                  <div class="space-y-5">
                    <div>
                      <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Workspace Name</label>
                      <input
                        v-model="workspaceName"
                        type="text"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Workspace URL</label>
                      <div class="flex items-center">
                        <span class="text-sm text-gray-400 bg-gray-50 px-4 py-2.5 border border-r-0 border-gray-200 rounded-l-xl font-mono">flowgent.io/</span>
                        <input
                          v-model="workspaceSlug"
                          type="text"
                          class="flex-1 px-4 py-2.5 border border-gray-200 rounded-r-xl text-sm text-gray-700 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                  <button
                    class="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 shadow-sm"
                    :disabled="savingWorkspace"
                    @click="saveWorkspace"
                  >
                    <LoadingSpinner v-if="savingWorkspace" size="sm" />
                    <span v-else>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Team Tab -->
            <div v-else-if="activeTab === 'team'" key="team" class="space-y-6">
              <!-- Invite with email chips -->
              <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 class="text-base font-semibold text-gray-900">Invite Team Members</h3>
                  <p class="text-xs text-gray-500 mt-0.5">Add colleagues by email. Press Enter or comma to add multiple.</p>
                </div>
                <div class="p-6">
                  <!-- Email Chips -->
                  <div v-if="emailChips.length > 0" class="flex flex-wrap gap-2 mb-3">
                    <div
                      v-for="email in emailChips"
                      :key="email"
                      class="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
                    >
                      <EnvelopeIcon class="w-3 h-3" />
                      {{ email }}
                      <button class="hover:text-red-500 transition-colors" @click="removeEmailChip(email)">
                        <XMarkIcon class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div class="flex gap-3">
                    <input
                      v-model="inviteEmail"
                      type="email"
                      placeholder="colleague@company.com"
                      class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all duration-200"
                      @keydown.enter.prevent="addEmailChip"
                      @keydown.188.prevent="addEmailChip"
                    />
                    <select
                      v-model="inviteRole"
                      class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all duration-200 bg-white"
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    <button
                      class="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-sm"
                      @click="inviteMembers"
                    >
                      <PlusIcon class="w-4 h-4" />
                      Invite
                    </button>
                  </div>
                </div>
              </div>

              <!-- Members as Cards -->
              <div>
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-sm font-semibold text-gray-900">Team Members ({{ teamMembers.length }})</h3>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    v-for="member in teamMembers"
                    :key="member.id"
                    class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-all duration-200"
                  >
                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <span class="text-base font-bold text-white">{{ member.name.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-gray-900">{{ member.name }}</p>
                      <p class="text-xs text-gray-500 truncate">{{ member.email }}</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <span
                        class="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize"
                        :class="[roleConfig[member.role]?.bg, roleConfig[member.role]?.text]"
                      >
                        <component :is="roleConfig[member.role]?.icon" v-if="roleConfig[member.role]?.icon" class="w-3 h-3" />
                        {{ member.role }}
                      </span>
                      <button
                        v-if="member.role !== 'owner'"
                        class="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                        @click="removeMember(member.id)"
                      >
                        <TrashIcon class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Billing Tab -->
            <div v-else-if="activeTab === 'billing'" key="billing" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  v-for="plan in plans"
                  :key="plan.id"
                  class="relative bg-white rounded-xl border-2 overflow-hidden transition-all duration-200 hover:shadow-md"
                  :class="currentPlan === plan.id ? 'border-indigo-500 shadow-lg shadow-indigo-500/10' : plan.popular && currentPlan !== plan.id ? 'border-purple-200' : 'border-gray-200'"
                >
                  <!-- Popular Badge -->
                  <div
                    v-if="plan.popular"
                    class="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl"
                  >
                    Popular
                  </div>

                  <div class="p-6">
                    <div class="mb-4">
                      <div class="flex items-center gap-2">
                        <h4 class="text-lg font-bold text-gray-900">{{ plan.label }}</h4>
                        <span v-if="currentPlan === plan.id" class="bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">Current</span>
                      </div>
                      <p class="text-xs text-gray-500 mt-0.5">{{ plan.description }}</p>
                    </div>
                    <p class="text-4xl font-bold text-gray-900 mb-1">
                      {{ plan.price }}
                      <span class="text-sm font-normal text-gray-400">/mo</span>
                    </p>

                    <!-- Feature Checklist -->
                    <ul class="space-y-2.5 mt-5 mb-6">
                      <li
                        v-for="feature in plan.features"
                        :key="feature"
                        class="flex items-center gap-2.5 text-sm text-gray-700"
                      >
                        <div class="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <CheckIcon class="w-2.5 h-2.5 text-emerald-600" />
                        </div>
                        {{ feature }}
                      </li>
                      <li
                        v-for="feature in plan.notIncluded"
                        :key="feature"
                        class="flex items-center gap-2.5 text-sm text-gray-400"
                      >
                        <div class="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <XMarkIcon class="w-2.5 h-2.5 text-gray-400" />
                        </div>
                        {{ feature }}
                      </li>
                    </ul>

                    <button
                      class="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                      :class="
                        currentPlan === plan.id
                          ? 'bg-gray-100 text-gray-500 cursor-default'
                          : plan.popular
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                      "
                      :disabled="currentPlan === plan.id"
                    >
                      {{ currentPlan === plan.id ? 'Current Plan' : 'Upgrade' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Invoice History -->
              <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 class="text-sm font-semibold text-gray-900">Invoice History</h3>
                </div>
                <div class="divide-y divide-gray-100">
                  <div v-for="i in 4" :key="i" class="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-all duration-200">
                    <div>
                      <p class="text-sm font-medium text-gray-700">Pro Plan - Monthly</p>
                      <p class="text-xs text-gray-400 mt-0.5">
                        {{ new Date(Date.now() - 86400000 * 30 * i).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
                      </p>
                    </div>
                    <div class="flex items-center gap-4">
                      <span class="text-sm font-semibold text-gray-900">$29.00</span>
                      <span class="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Paid</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notifications Tab -->
            <div v-else-if="activeTab === 'notifications'" key="notifications" class="space-y-6">
              <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 class="text-base font-semibold text-gray-900">Email Notifications</h3>
                  <p class="text-xs text-gray-500 mt-0.5">Choose which emails you want to receive</p>
                </div>
                <div class="divide-y divide-gray-50">
                  <label
                    v-for="item in notificationItems"
                    :key="item.key"
                    class="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition-all duration-200 group"
                  >
                    <div>
                      <p class="text-sm font-medium text-gray-900 group-hover:text-indigo-700 transition-colors">{{ item.title }}</p>
                      <p class="text-xs text-gray-500">{{ item.desc }}</p>
                    </div>
                    <div class="relative">
                      <input v-model="notificationSettings[item.key]" type="checkbox" class="sr-only peer" />
                      <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-500 transition-all duration-300" />
                      <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-5 transition-all duration-300" />
                    </div>
                  </label>
                </div>

                <div class="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                  <button
                    class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-sm"
                    @click="addToast('Notification preferences saved', 'success')"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
