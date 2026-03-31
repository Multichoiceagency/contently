export default defineNuxtRouteMiddleware((to) => {
  // Allow auth routes without authentication
  if (to.path.startsWith('/auth')) {
    return
  }

  // Check for token in localStorage (client-side only)
  if (import.meta.client) {
    const token = localStorage.getItem('flowgent_token')
    if (!token) {
      return navigateTo('/auth/login')
    }
  }
})
