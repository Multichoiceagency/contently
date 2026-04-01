<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const { forgotPassword, resetPassword } = useAuth()
const { addToast } = useToast()
const router = useRouter()

const step = ref<'email' | 'reset'>('email')
const email = ref('')
const code = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

const handleSendCode = async () => {
  if (!email.value) {
    error.value = 'Please enter your email'
    return
  }
  error.value = ''
  loading.value = true
  const result = await forgotPassword(email.value)
  loading.value = false
  if (result.success) {
    step.value = 'reset'
    addToast('If that email exists, a reset code has been sent.', 'success')
  } else {
    error.value = result.error || 'Failed to send reset code'
  }
}

const handleReset = async () => {
  if (!code.value || code.value.length !== 6) {
    error.value = 'Please enter the 6-digit code'
    return
  }
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  error.value = ''
  loading.value = true
  const result = await resetPassword(email.value, code.value, password.value)
  loading.value = false
  if (result.success) {
    addToast('Password reset successfully. Please log in.', 'success')
    await router.push('/auth/login')
  } else {
    error.value = result.error || 'Reset failed'
  }
}
</script>

<template>
  <div>
    <!-- Step 1: Enter email -->
    <template v-if="step === 'email'">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">Forgot password?</h1>
      <p class="text-sm text-gray-500 mb-8">Enter your email and we'll send you a reset code.</p>

      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {{ error }}
        </div>
      </Transition>

      <form @submit.prevent="handleSendCode" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="you@company.com"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50/50 hover:bg-gray-50"
            autocomplete="email"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white h-12 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-600/20"
        >
          <LoadingSpinner v-if="loading" size="sm" />
          <span v-else>Send Reset Code</span>
        </button>
      </form>
    </template>

    <!-- Step 2: Enter code + new password -->
    <template v-else>
      <h1 class="text-2xl font-bold text-gray-900 mb-1">Reset your password</h1>
      <p class="text-sm text-gray-500 mb-8">Enter the code sent to <span class="font-semibold text-gray-700">{{ email }}</span></p>

      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {{ error }}
        </div>
      </Transition>

      <form @submit.prevent="handleReset" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Reset Code</label>
          <input
            v-model="code"
            type="text"
            inputmode="numeric"
            maxlength="6"
            placeholder="000000"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 text-center tracking-[0.5em] font-bold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50/50"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Min. 8 characters"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50/50"
            autocomplete="new-password"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50/50"
            autocomplete="new-password"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white h-12 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-600/20"
        >
          <LoadingSpinner v-if="loading" size="sm" />
          <span v-else>Reset Password</span>
        </button>
      </form>
    </template>

    <p class="text-center text-sm text-gray-500 mt-6">
      <NuxtLink to="/auth/login" class="text-indigo-600 hover:text-indigo-700 font-medium">
        Back to login
      </NuxtLink>
    </p>
  </div>
</template>
