<script setup lang="ts">
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'auth',
})

const { login, googleLogin } = useAuth()
const { addToast } = useToast()
const config = useRuntimeConfig()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const googleLoading = ref(false)
const error = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }
  loading.value = true
  const result = await login(email.value, password.value)
  loading.value = false
  if (!result.success) {
    error.value = result.error || 'Login failed'
    addToast(error.value, 'error')
  }
}

const handleGoogleLogin = () => {
  const clientId = config.public.googleClientId as string
  if (!clientId) {
    error.value = 'Google login is not configured'
    return
  }

  googleLoading.value = true
  error.value = ''

  // Use Google Identity Services
  const w = window as any
  if (!w.google?.accounts?.id) {
    error.value = 'Google sign-in is loading, please try again'
    googleLoading.value = false
    return
  }

  w.google.accounts.id.initialize({
    client_id: clientId,
    callback: async (response: any) => {
      if (response.credential) {
        const result = await googleLogin(response.credential)
        googleLoading.value = false
        if (!result.success) {
          error.value = result.error || 'Google login failed'
          addToast(error.value, 'error')
        }
      } else {
        googleLoading.value = false
        error.value = 'Google sign-in was cancelled'
      }
    },
  })

  w.google.accounts.id.prompt((notification: any) => {
    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
      // Fallback: render the Google button in a hidden container and click it
      const container = document.createElement('div')
      container.style.display = 'none'
      document.body.appendChild(container)

      w.google.accounts.id.renderButton(container, {
        type: 'standard',
        size: 'large',
      })

      const btn = container.querySelector('[role="button"]') as HTMLElement
      if (btn) btn.click()

      setTimeout(() => {
        document.body.removeChild(container)
        googleLoading.value = false
      }, 5000)
    }
  })
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
    <p class="text-sm text-gray-500 mb-8">Sign in to your account</p>

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

    <form @submit.prevent="handleLogin" class="space-y-4">
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

      <!-- Password -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
        <div class="relative">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter your password"
            class="w-full px-4 py-3 pr-11 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-gray-50"
            autocomplete="current-password"
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
      </div>

      <!-- Remember me + Forgot -->
      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            v-model="rememberMe"
            type="checkbox"
            class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span class="text-sm text-gray-600">Remember me</span>
        </label>
        <NuxtLink to="/auth/forgot-password" class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          Forgot password?
        </NuxtLink>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white h-12 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-600/20"
      >
        <LoadingSpinner v-if="loading" size="sm" />
        <span v-else>Sign In</span>
      </button>
    </form>

    <!-- Divider -->
    <div class="relative my-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-200" />
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-3 bg-white/90 text-gray-400">or continue with</span>
      </div>
    </div>

    <!-- Google Login -->
    <div>
      <button
        @click="handleGoogleLogin"
        :disabled="googleLoading"
        class="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg v-if="!googleLoading" class="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <LoadingSpinner v-else size="sm" />
        Continue with Google
      </button>
    </div>

    <!-- Register link -->
    <p class="text-center text-sm text-gray-500 mt-6">
      Don't have an account?
      <NuxtLink to="/auth/register" class="text-indigo-600 hover:text-indigo-700 font-medium">
        Sign up
      </NuxtLink>
    </p>
  </div>
</template>
