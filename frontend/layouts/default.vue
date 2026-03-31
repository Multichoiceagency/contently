<script setup lang="ts">
const { restoreSession } = useAuth()

onMounted(() => {
  restoreSession()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppSidebar />
    <div class="ml-[260px]">
      <slot />
    </div>
    <Toast />
  </div>
</template>
