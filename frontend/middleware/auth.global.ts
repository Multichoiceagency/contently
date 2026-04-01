export default defineNuxtRouteMiddleware((to) => {
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth',
    '/publish',
    '/ai-studio',
    '/analyze',
    '/engage',
    '/discover',
    '/pricing',
    '/demo',
    '/about',
    '/blog',
    '/changelog',
    '/contact',
    '/affiliate',
    '/api',
    '/careers',
    '/resources',
  ]

  // Allow auth routes without authentication
  if (to.path.startsWith('/auth')) {
    return
  }

  // Allow public/landing pages without authentication
  const isPublicRoute = publicRoutes.includes(to.path) || to.path.startsWith('/solutions')
  if (isPublicRoute) {
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
