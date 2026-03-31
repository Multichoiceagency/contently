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
const savingProfile = ref(false)

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
  { id: '2', userId: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'admin', joinedAt: new Date().toISOString() },
  { id: '3', userId: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'editor', joinedAt: new Date().toISOString() },
])

const inviteEmail = ref('')
const inviteRole = ref('editor')

const inviteMember = () => {
  if (!inviteEmail.value) return
  teamMembers.value.push({
    id: Date.now().toString(),
    userId: Date.now().toString(),
    name: inviteEmail.value.split('@')[0],
    email: inviteEmail.value,
    role: inviteRole.value as any,
    joinedAt: new Date().toISOString(),
  })
  addToast(`Invitation sent to ${inviteEmail.value}`, 'success')
  inviteEmail.value = ''
}

const removeMember = (id: string) => {
  teamMembers.value = teamMembers.value.filter(m => m.id !== id)
  addToast('Team member removed', 'success')
}

// Billing
const currentPlan = ref('pro')
const plans = [
  { id: 'free', label: 'Free', price: '$0', features: ['3 social accounts', '30 posts/month', 'Basic analytics'], highlight: false },
  { id: 'pro', label: 'Pro', price: '$29', features: ['10 social accounts', 'Unlimited posts', 'AI generator', 'Advanced analytics', 'Team collaboration'], highlight: true },
  { id: 'enterprise', label: 'Enterprise', price: '$99', features: ['Unlimited accounts', 'Unlimited posts', 'Priority AI', 'Custom reports', 'API access', 'Dedicated support'], highlight: false },
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
</script>

<template>
  <div>
    <AppTopbar title="Settings" subtitle="Manage your account and workspace preferences.">
      <template #action><span /></template>
    </AppTopbar>

    <div class="p-6">
      <div class="flex gap-8">
        <!-- Tabs -->
        <div class="w-56 flex-shrink-0">
          <nav class="space-y-1 sticky top-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
              :class="
                activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              "
              @click="activeTab = tab.id"
            >
              <component
                :is="tab.icon"
                class="w-5 h-5 transition-colors duration-200"
                :class="activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400'"
              />
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- Content -->
        <div class="flex-1 max-w-2xl">
          <!-- Profile Tab -->
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
            mode="out-in"
          >
            <div v-if="activeTab === 'profile'" key="profile" class="space-y-6">
              <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h3>

                <!-- Avatar -->
                <div class="flex items-center gap-5 mb-6">
                  <div class="relative group">
                    <div class="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-4 ring-indigo-50">
                      <span class="text-2xl font-bold text-white">{{ profileName.charAt(0).toUpperCase() }}</span>
                    </div>
                    <button class="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                      <CameraIcon class="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <div>
                    <button class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200">
                      <CameraIcon class="w-4 h-4" />
                      Change Avatar
                    </button>
                    <p class="text-xs text-gray-400 mt-1.5">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input
                      v-model="profileName"
                      type="text"
                      class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input
                      v-model="profileEmail"
                      type="email"
                      class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                    />
                  </div>
                  <div class="pt-2">
                    <button
                      class="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 shadow-sm shadow-indigo-600/20"
                      :disabled="savingProfile"
                      @click="saveProfile"
                    >
                      <LoadingSpinner v-if="savingProfile" size="sm" />
                      <span v-else>Save Changes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Workspace Tab -->
            <div v-else-if="activeTab === 'workspace'" key="workspace" class="space-y-6">
              <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-6">Workspace Settings</h3>

                <div class="flex items-center gap-5 mb-6">
                  <div class="relative group">
                    <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <span class="text-2xl font-bold text-white">{{ workspaceName.charAt(0).toUpperCase() }}</span>
                    </div>
                    <button class="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                      <CameraIcon class="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <div>
                    <button class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200">
                      <CameraIcon class="w-4 h-4" />
                      Change Logo
                    </button>
                    <p class="text-xs text-gray-400 mt-1.5">Square image recommended. Max 2MB.</p>
                  </div>
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Workspace Name</label>
                    <input
                      v-model="workspaceName"
                      type="text"
                      class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Workspace URL</label>
                    <div class="flex items-center">
                      <span class="text-sm text-gray-400 bg-gray-100 px-4 py-2.5 border border-r-0 border-gray-200 rounded-l-xl">flowgent.io/</span>
                      <input
                        v-model="workspaceSlug"
                        type="text"
                        class="flex-1 px-4 py-2.5 border border-gray-200 rounded-r-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                      />
                    </div>
                  </div>
                  <div class="pt-2">
                    <button
                      class="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 shadow-sm shadow-indigo-600/20"
                      :disabled="savingWorkspace"
                      @click="saveWorkspace"
                    >
                      <LoadingSpinner v-if="savingWorkspace" size="sm" />
                      <span v-else>Save Changes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Team Tab -->
            <div v-else-if="activeTab === 'team'" key="team" class="space-y-6">
              <!-- Invite -->
              <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Invite Team Member</h3>
                <div class="flex gap-3">
                  <input
                    v-model="inviteEmail"
                    type="email"
                    placeholder="colleague@company.com"
                    class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                  />
                  <select
                    v-model="inviteRole"
                    class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-gray-50/50"
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <button
                    class="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm shadow-indigo-600/20"
                    @click="inviteMember"
                  >
                    <PlusIcon class="w-4 h-4" />
                    Invite
                  </button>
                </div>
              </div>

              <!-- Members List -->
              <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div class="px-6 py-4 border-b border-gray-100">
                  <h3 class="text-sm font-semibold text-gray-900">Team Members ({{ teamMembers.length }})</h3>
                </div>
                <div class="divide-y divide-gray-100">
                  <div
                    v-for="member in teamMembers"
                    :key="member.id"
                    class="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-all duration-200"
                  >
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                      <span class="text-sm font-semibold text-indigo-600">{{ member.name.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900">{{ member.name }}</p>
                      <p class="text-xs text-gray-500">{{ member.email }}</p>
                    </div>
                    <select
                      v-if="member.role !== 'owner'"
                      :value="member.role"
                      class="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-transparent"
                      @change="member.role = ($event.target as HTMLSelectElement).value as any"
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Member</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    <span
                      v-else
                      class="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700"
                    >
                      Owner
                    </span>
                    <button
                      v-if="member.role !== 'owner'"
                      class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                      @click="removeMember(member.id)"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
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
                  class="relative bg-white rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-md"
                  :class="currentPlan === plan.id ? 'border-indigo-500 shadow-md shadow-indigo-500/10' : 'border-gray-200'"
                >
                  <!-- Popular badge -->
                  <div
                    v-if="plan.highlight"
                    class="absolute -top-3 left-1/2 -translate-x-1/2"
                  >
                    <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm">
                      <StarIcon class="w-3 h-3" />
                      Popular
                    </span>
                  </div>

                  <div class="flex items-center justify-between mb-4">
                    <h4 class="text-lg font-bold text-gray-900">{{ plan.label }}</h4>
                    <span v-if="currentPlan === plan.id" class="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">Current</span>
                  </div>
                  <p class="text-3xl font-bold text-gray-900 mb-1">
                    {{ plan.price }}
                    <span class="text-sm font-normal text-gray-500">/month</span>
                  </p>
                  <ul class="space-y-2.5 mt-5 mb-6">
                    <li
                      v-for="feature in plan.features"
                      :key="feature"
                      class="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <CheckIcon class="w-4 h-4 text-green-500 flex-shrink-0" />
                      {{ feature }}
                    </li>
                  </ul>
                  <button
                    class="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                    :class="
                      currentPlan === plan.id
                        ? 'bg-gray-100 text-gray-500 cursor-default'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-600/20'
                    "
                    :disabled="currentPlan === plan.id"
                  >
                    {{ currentPlan === plan.id ? 'Current Plan' : 'Upgrade' }}
                  </button>
                </div>
              </div>

              <!-- Invoice History -->
              <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div class="px-6 py-4 border-b border-gray-100">
                  <h3 class="text-sm font-semibold text-gray-900">Invoice History</h3>
                </div>
                <div class="divide-y divide-gray-100">
                  <div v-for="i in 4" :key="i" class="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50 transition-all duration-200">
                    <div>
                      <p class="text-sm text-gray-700 font-medium">Pro Plan - Monthly</p>
                      <p class="text-xs text-gray-400 mt-0.5">
                        {{ new Date(Date.now() - 86400000 * 30 * i).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
                      </p>
                    </div>
                    <div class="flex items-center gap-4">
                      <span class="text-sm font-semibold text-gray-900">$29.00</span>
                      <span class="text-xs text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full font-medium">Paid</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notifications Tab -->
            <div v-else-if="activeTab === 'notifications'" key="notifications" class="space-y-6">
              <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-6">Email Notifications</h3>
                <div class="space-y-5">
                  <label class="flex items-center justify-between cursor-pointer group py-1">
                    <div>
                      <p class="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">New post created</p>
                      <p class="text-xs text-gray-500 mt-0.5">Get notified when a team member creates a new post</p>
                    </div>
                    <div class="relative">
                      <input v-model="notificationSettings.emailNewPost" type="checkbox" class="sr-only peer" />
                      <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-500 transition-all duration-200" />
                      <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-5 transition-all duration-200" />
                    </div>
                  </label>
                  <label class="flex items-center justify-between cursor-pointer group py-1">
                    <div>
                      <p class="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">Post published</p>
                      <p class="text-xs text-gray-500 mt-0.5">Get notified when a scheduled post is published</p>
                    </div>
                    <div class="relative">
                      <input v-model="notificationSettings.emailPostPublished" type="checkbox" class="sr-only peer" />
                      <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-500 transition-all duration-200" />
                      <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-5 transition-all duration-200" />
                    </div>
                  </label>
                  <label class="flex items-center justify-between cursor-pointer group py-1">
                    <div>
                      <p class="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">Weekly report</p>
                      <p class="text-xs text-gray-500 mt-0.5">Receive a weekly performance summary</p>
                    </div>
                    <div class="relative">
                      <input v-model="notificationSettings.emailWeeklyReport" type="checkbox" class="sr-only peer" />
                      <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-500 transition-all duration-200" />
                      <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-5 transition-all duration-200" />
                    </div>
                  </label>
                  <label class="flex items-center justify-between cursor-pointer group py-1">
                    <div>
                      <p class="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">Team activity</p>
                      <p class="text-xs text-gray-500 mt-0.5">Get notified about team member actions</p>
                    </div>
                    <div class="relative">
                      <input v-model="notificationSettings.emailTeamActivity" type="checkbox" class="sr-only peer" />
                      <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-500 transition-all duration-200" />
                      <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-5 transition-all duration-200" />
                    </div>
                  </label>
                  <label class="flex items-center justify-between cursor-pointer group py-1">
                    <div>
                      <p class="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">AI Suggestions</p>
                      <p class="text-xs text-gray-500 mt-0.5">Receive AI-powered content recommendations</p>
                    </div>
                    <div class="relative">
                      <input v-model="notificationSettings.emailAiSuggestions" type="checkbox" class="sr-only peer" />
                      <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-500 transition-all duration-200" />
                      <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-5 transition-all duration-200" />
                    </div>
                  </label>
                  <label class="flex items-center justify-between cursor-pointer group py-1">
                    <div>
                      <p class="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">Billing notifications</p>
                      <p class="text-xs text-gray-500 mt-0.5">Get notified about invoices and payment status</p>
                    </div>
                    <div class="relative">
                      <input v-model="notificationSettings.emailBilling" type="checkbox" class="sr-only peer" />
                      <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-500 transition-all duration-200" />
                      <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-5 transition-all duration-200" />
                    </div>
                  </label>
                </div>

                <div class="pt-6 mt-6 border-t border-gray-100">
                  <button
                    class="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm shadow-indigo-600/20"
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
