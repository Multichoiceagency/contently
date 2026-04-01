export default defineNuxtRouteMiddleware((to) => {
  const dashboardDomain = 'dashboard.contentrich.nl'
  const mainDomain = 'contentrich.nl'

  // Detect which subdomain we're on (works for SSR + client)
  let hostname = ''
  if (import.meta.server) {
    const event = useRequestEvent()
    hostname = event?.node?.req?.headers?.host?.replace(/:\d+$/, '') || ''
  } else {
    hostname = window.location.hostname
  }

  const isDashboard = hostname === dashboardDomain || hostname.startsWith('dashboard.')
  const isMainSite = !isDashboard

  // Public/landing routes (only available on main domain)
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

  const isAuthRoute = to.path.startsWith('/auth')
  const isPublicRoute = publicRoutes.includes(to.path) || to.path.startsWith('/solutions')

  // --- MAIN DOMAIN (contentrich.nl) ---
  if (isMainSite) {
    // Allow all public and auth routes on the main domain
    if (isPublicRoute || isAuthRoute) {
      return
    }
    // Protected routes on main domain → redirect to dashboard subdomain
    if (import.meta.client) {
      const token = localStorage.getItem('flowgent_token')
      if (token) {
        window.location.href = `https://${dashboardDomain}${to.path}`
        return abortNavigation()
      }
      return navigateTo('/auth/login')
    }
    return
  }

  // --- DASHBOARD SUBDOMAIN (dashboard.contentrich.nl) ---
  if (isDashboard) {
    // Redirect landing page to /dashboard on the subdomain
    if (to.path === '/') {
      return navigateTo('/dashboard')
    }

    // Allow auth routes
    if (isAuthRoute) {
      return
    }

    // Check for token on protected routes
    if (import.meta.client) {
      const token = localStorage.getItem('flowgent_token')
      if (!token) {
        return navigateTo('/auth/login')
      }
    }
    return
  }

  // --- LOCAL DEV / FALLBACK ---
  // Allow auth routes
  if (isAuthRoute) {
    return
  }

  // Allow public routes
  if (isPublicRoute) {
    return
  }

  // Check for token on protected routes
  if (import.meta.client) {
    const token = localStorage.getItem('flowgent_token')
    if (!token) {
      return navigateTo('/auth/login')
    }
  }
})
