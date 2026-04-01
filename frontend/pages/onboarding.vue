<script setup lang="ts">
import {
  BuildingOffice2Icon,
  ShareIcon,
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  RocketLaunchIcon,
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default',
})

const router = useRouter()
const { user } = useAuth()
const { createWorkspace, loadWorkspaces, current } = useWorkspace()
const { addToast } = useToast()

const step = ref(1)
const totalSteps = 3

// Step 1: Workspace
const workspaceName = ref('')
const creatingWorkspace = ref(false)

// Step 2: Profile info
const industry = ref('')
const companySize = ref('')

const industries = [
  'Marketing & Advertising',
  'E-commerce & Retail',
  'Technology & SaaS',
  'Real Estate',
  'Healthcare',
  'Education',
  'Finance',
  'Food & Hospitality',
  'Other',
]

const companySizes = [
  '1 person (Freelancer)',
  '2-10 employees',
  '11-50 employees',
  '51-200 employees',
  '200+ employees',
]

const handleCreateWorkspace = async () => {
  if (!workspaceName.value.trim()) {
    addToast('Enter a workspace name', 'error')
    return
  }
  creatingWorkspace.value = true
  const result = await createWorkspace(workspaceName.value.trim())
  creatingWorkspace.value = false
  if (result.success) {
    step.value = 2
  } else {
    addToast(result.error || 'Failed to create workspace', 'error')
  }
}

const handleProfileNext = () => {
  step.value = 3
}

const handleFinish = () => {
  addToast('You\'re all set! Welcome to Contentrich.', 'success')
  router.push('/dashboard')
}

const firstName = computed(() => user.value?.name?.split(' ')[0] || '')
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
    <div class="w-full max-w-xl">
      <!-- Progress -->
      <div class="flex items-center gap-2 mb-8">
        <div
          v-for="s in totalSteps"
          :key="s"
          class="flex-1 h-1.5 rounded-full transition-all duration-500"
          :class="s <= step ? 'bg-indigo-600' : 'bg-gray-200'"
        />
      </div>

      <!-- Step 1: Create Workspace -->
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 translate-x-8"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 -translate-x-8"
        mode="out-in"
      >
        <div v-if="step === 1" key="step1" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div class="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
            <BuildingOffice2Icon class="w-7 h-7 text-indigo-600" />
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Create your workspace</h1>
          <p class="text-gray-500 mb-8">
            Hi {{ firstName }}! A workspace is where you manage your social media content. This can be your company or brand name.
          </p>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Workspace Name</label>
              <input
                v-model="workspaceName"
                type="text"
                placeholder="e.g. My Company, Brand Name"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50/50"
                @keydown.enter="handleCreateWorkspace"
              />
            </div>

            <button
              :disabled="creatingWorkspace || !workspaceName.trim()"
              class="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white h-12 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-600/20"
              @click="handleCreateWorkspace"
            >
              <LoadingSpinner v-if="creatingWorkspace" size="sm" />
              <template v-else>
                <span>Continue</span>
                <ArrowRightIcon class="w-4 h-4" />
              </template>
            </button>
          </div>
        </div>

        <!-- Step 2: Industry & Company Info -->
        <div v-else-if="step === 2" key="step2" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div class="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
            <SparklesIcon class="w-7 h-7 text-purple-600" />
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Tell us about your business</h1>
          <p class="text-gray-500 mb-8">
            This helps us personalize your AI content suggestions. You can skip this step.
          </p>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Industry</label>
              <select
                v-model="industry"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50/50 appearance-none"
              >
                <option value="">Select your industry</option>
                <option v-for="ind in industries" :key="ind" :value="ind">{{ ind }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Company Size</label>
              <select
                v-model="companySize"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50/50 appearance-none"
              >
                <option value="">Select company size</option>
                <option v-for="size in companySizes" :key="size" :value="size">{{ size }}</option>
              </select>
            </div>

            <div class="flex gap-3 pt-2">
              <button
                class="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white h-12 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-sm shadow-indigo-600/20"
                @click="handleProfileNext"
              >
                <span>Continue</span>
                <ArrowRightIcon class="w-4 h-4" />
              </button>
            </div>
            <button
              class="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
              @click="handleProfileNext"
            >
              Skip this step
            </button>
          </div>
        </div>

        <!-- Step 3: Ready -->
        <div v-else key="step3" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div class="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon class="w-8 h-8 text-emerald-600" />
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">You're all set!</h1>
          <p class="text-gray-500 mb-8 max-w-sm mx-auto">
            Your workspace <span class="font-semibold text-gray-700">{{ current?.name }}</span> is ready. Here's what you can do next:
          </p>

          <div class="space-y-3 mb-8 text-left max-w-sm mx-auto">
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <ShareIcon class="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <p class="text-sm font-medium text-gray-900">Connect your social accounts</p>
                <p class="text-xs text-gray-500">LinkedIn, Facebook, Instagram, X</p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <SparklesIcon class="w-5 h-5 text-purple-600 flex-shrink-0" />
              <div>
                <p class="text-sm font-medium text-gray-900">Generate your first content</p>
                <p class="text-xs text-gray-500">Use AI to create engaging posts</p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <RocketLaunchIcon class="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p class="text-sm font-medium text-gray-900">Schedule and publish</p>
                <p class="text-xs text-gray-500">Plan your content calendar</p>
              </div>
            </div>
          </div>

          <button
            class="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white h-12 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-sm shadow-indigo-600/20"
            @click="handleFinish"
          >
            <RocketLaunchIcon class="w-4 h-4" />
            Go to Dashboard
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>
