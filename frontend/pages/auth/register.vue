<script setup lang="ts">
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'auth',
})

const { register } = useAuth()
const { addToast } = useToast()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const workspaceName = ref('')
const agreeTerms = ref(false)
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordStrength = computed(() => {
  const pwd = password.value
  if (!pwd) return { level: 0, label: '', color: '' }

  let score = 0
  if (pwd.length >= 8) score++
  if (pwd.length >= 12) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++

  if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-red-500' }
  if (score === 2) return { level: 2, label: 'Fair', color: 'bg-orange-500' }
  if (score === 3) return { level: 3, label: 'Good', color: 'bg-yellow-500' }
  if (score >= 4) return { level: 4, label: 'Strong', color: 'bg-green-500' }
  return { level: 0, label: '', color: '' }
})

const handleRegister = async () => {
  error.value = ''

  if (!name.value || !email.value || !password.value || !confirmPassword.value || !workspaceName.value) {
    error.value = 'Please fill in all fields'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters'
    return
  }

  if (!agreeTerms.value) {
    error.value = 'Please agree to the terms and conditions'
    return
  }

  loading.value = true
  const result = await register(name.value, email.value, password.value, workspaceName.value)
  loading.value = false

  if (!result.success) {
    error.value = result.error || 'Registration failed'
    addToast(error.value, 'error')
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
    <p class="text-sm text-gray-500 mb-8">Start your free trial of Flowgent</p>

    <!-- Error -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="error"
        class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2"
      >
        <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
        </svg>
        {{ error }}
      </div>
    </Transition>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <!-- Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
        <input
          v-model="name"
          type="text"
          placeholder="John Doe"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-gray-50"
          autocomplete="name"
        />
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="you@company.com"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-gray-50"
          autocomplete="email"
        />
      </div>

      <!-- Workspace Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Workspace Name</label>
        <input
          v-model="workspaceName"
          type="text"
          placeholder="My Company"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-gray-50"
        />
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
        <div class="relative">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Min. 8 characters"
            class="w-full px-4 py-3 pr-11 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-gray-50"
            autocomplete="new-password"
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            @click="showPassword = !showPassword"
          >
            <EyeSlashIcon v-if="showPassword" class="w-5 h-5" />
            <EyeIcon v-else class="w-5 h-5" />
          </button>
        </div>
        <!-- Password Strength Bar -->
        <div v-if="password" class="mt-2">
          <div class="flex items-center gap-2">
            <div class="flex-1 flex gap-1">
              <div
                v-for="i in 4"
                :key="i"
                class="h-1.5 flex-1 rounded-full transition-all duration-300"
                :class="i <= passwordStrength.level ? passwordStrength.color : 'bg-gray-200'"
              />
            </div>
            <span
              class="text-xs font-medium"
              :class="{
                'text-red-500': passwordStrength.level === 1,
                'text-orange-500': passwordStrength.level === 2,
                'text-yellow-600': passwordStrength.level === 3,
                'text-green-600': passwordStrength.level === 4,
              }"
            >
              {{ passwordStrength.label }}
            </span>
          </div>
        </div>
      </div>

      <!-- Confirm Password -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
        <div class="relative">
          <input
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Repeat your password"
            class="w-full px-4 py-3 pr-11 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-gray-50"
            autocomplete="new-password"
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <EyeSlashIcon v-if="showConfirmPassword" class="w-5 h-5" />
            <EyeIcon v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Terms -->
      <label class="flex items-start gap-2.5 cursor-pointer">
        <input
          v-model="agreeTerms"
          type="checkbox"
          class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-0.5"
        />
        <span class="text-sm text-gray-600">
          I agree to the
          <a href="#" class="text-indigo-600 hover:text-indigo-700 font-medium">Terms of Service</a>
          and
          <a href="#" class="text-indigo-600 hover:text-indigo-700 font-medium">Privacy Policy</a>
        </span>
      </label>

      <!-- Submit -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white h-12 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-600/20"
      >
        <LoadingSpinner v-if="loading" size="sm" />
        <span v-else>Create Account</span>
      </button>
    </form>

    <!-- Login link -->
    <p class="text-center text-sm text-gray-500 mt-6">
      Already have an account?
      <NuxtLink to="/auth/login" class="text-indigo-600 hover:text-indigo-700 font-medium">
        Sign in
      </NuxtLink>
    </p>
  </div>
</template>
