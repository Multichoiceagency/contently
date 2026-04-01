<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const route = useRoute()
const { verifyEmail, resendCode } = useAuth()
const { addToast } = useToast()

const email = computed(() => (route.query.email as string) || '')
const digits = ref<string[]>(['', '', '', '', '', ''])
const loading = ref(false)
const resending = ref(false)
const error = ref('')
const cooldown = ref(0)

let cooldownTimer: ReturnType<typeof setInterval> | null = null

const inputRefs = ref<HTMLInputElement[]>([])

const code = computed(() => digits.value.join(''))

const handleInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const val = target.value.replace(/\D/g, '')
  digits.value[index] = val.slice(-1)

  if (val && index < 5) {
    inputRefs.value[index + 1]?.focus()
  }

  if (code.value.length === 6) {
    handleVerify()
  }
}

const handleKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pasted = (event.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6)
  for (let i = 0; i < 6; i++) {
    digits.value[i] = pasted[i] || ''
  }
  if (pasted.length === 6) {
    handleVerify()
  }
}

const handleVerify = async () => {
  if (code.value.length !== 6) {
    error.value = 'Please enter the 6-digit code'
    return
  }
  error.value = ''
  loading.value = true
  const result = await verifyEmail(email.value, code.value)
  loading.value = false
  if (!result.success) {
    error.value = result.error || 'Invalid code'
    digits.value = ['', '', '', '', '', '']
    inputRefs.value[0]?.focus()
  }
}

const handleResend = async () => {
  if (cooldown.value > 0) return
  resending.value = true
  const result = await resendCode(email.value)
  resending.value = false
  if (result.success) {
    addToast('A new code has been sent to your email', 'success')
    cooldown.value = 60
    cooldownTimer = setInterval(() => {
      cooldown.value--
      if (cooldown.value <= 0 && cooldownTimer) {
        clearInterval(cooldownTimer)
        cooldownTimer = null
      }
    }, 1000)
  } else {
    addToast(result.error || 'Failed to resend', 'error')
  }
}

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-1">Verify your email</h1>
    <p class="text-sm text-gray-500 mb-2">
      We've sent a 6-digit code to
    </p>
    <p class="text-sm font-semibold text-gray-700 mb-6">{{ email }}</p>

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

    <!-- Code Input -->
    <div class="flex justify-center gap-3 mb-6" @paste="handlePaste">
      <input
        v-for="(_, i) in 6"
        :key="i"
        :ref="(el) => { if (el) inputRefs[i] = el as HTMLInputElement }"
        :value="digits[i]"
        type="text"
        inputmode="numeric"
        maxlength="1"
        class="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
        :class="{ 'border-red-300': error }"
        @input="handleInput(i, $event)"
        @keydown="handleKeydown(i, $event)"
      />
    </div>

    <!-- Verify Button -->
    <button
      :disabled="loading || code.length !== 6"
      class="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white h-12 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-600/20"
      @click="handleVerify"
    >
      <LoadingSpinner v-if="loading" size="sm" />
      <span v-else>Verify Email</span>
    </button>

    <!-- Resend -->
    <p class="text-center text-sm text-gray-500 mt-6">
      Didn't receive the code?
      <button
        :disabled="cooldown > 0 || resending"
        class="text-indigo-600 hover:text-indigo-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
        @click="handleResend"
      >
        <span v-if="cooldown > 0">Resend in {{ cooldown }}s</span>
        <span v-else-if="resending">Sending...</span>
        <span v-else>Resend code</span>
      </button>
    </p>

    <!-- Back to login -->
    <p class="text-center text-sm text-gray-500 mt-3">
      <NuxtLink to="/auth/login" class="text-indigo-600 hover:text-indigo-700 font-medium">
        Back to login
      </NuxtLink>
    </p>
  </div>
</template>
