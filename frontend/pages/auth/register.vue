<script setup lang="ts">
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
    <div
      v-if="error"
      class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl"
    >
      {{ error }}
    </div>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <!-- Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
        <input
          v-model="name"
          type="text"
          placeholder="John Doe"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
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
          class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
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
          class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Min. 8 characters"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
          autocomplete="new-password"
        />
      </div>

      <!-- Confirm Password -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Repeat your password"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
          autocomplete="new-password"
        />
      </div>

      <!-- Terms -->
      <label class="flex items-start gap-2 cursor-pointer">
        <input
          v-model="agreeTerms"
          type="checkbox"
          class="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500 mt-0.5"
        />
        <span class="text-sm text-gray-600">
          I agree to the
          <a href="#" class="text-brand-600 hover:text-brand-700 font-medium">Terms of Service</a>
          and
          <a href="#" class="text-brand-600 hover:text-brand-700 font-medium">Privacy Policy</a>
        </span>
      </label>

      <!-- Submit -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full flex items-center justify-center gap-2 bg-brand-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <LoadingSpinner v-if="loading" size="sm" />
        <span v-else>Create Account</span>
      </button>
    </form>

    <!-- Login link -->
    <p class="text-center text-sm text-gray-500 mt-6">
      Already have an account?
      <NuxtLink to="/auth/login" class="text-brand-600 hover:text-brand-700 font-medium">
        Sign in
      </NuxtLink>
    </p>
  </div>
</template>
