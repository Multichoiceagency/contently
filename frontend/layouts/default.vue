<script setup lang="ts">
const { restoreSession } = useAuth()

const sidebarCollapsed = ref(false)

onMounted(() => {
  restoreSession()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50/80">
    <AppSidebar />
    <div class="transition-all duration-300 lg:ml-[260px]">
      <div class="page-transition">
        <slot />
      </div>
    </div>
    <Toast />
  </div>
</template>

<style scoped>
.page-transition {
  animation: fadeSlideIn 0.3s ease-out;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
