export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig()
  const dashboardDomain = config.public.dashboardDomain || 'dashboard.contentrich.nl'
  const mainDomain = config.public.mainDomain || 'contentrich.nl'

  // Read token from cookie (shared across subdomains, works on SSR + client)
  const tokenCookie = useCookie('flowgent_token')
  const hasToken = !!tokenCookie.value

  // Detect which subdomain we're on
  let hostname = ''
  if (import.meta.server) {
    const event = useRequestEvent()
    hostname = event?.node?.req?.headers?.host?.replace(/:\d+$/, '') || ''
  } else {
    hostname = window.location.hostname
  }

  const isDashboard = hostname === dashboardDomain || hostname.startsWith('dashboard.')
  const isLocalDev = hostname === 'localhost' || hostname === '127.0.0.1'
  const isMainSite = !isDashboard && !isLocalDev

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
    if (isPublicRoute || isAuthRoute) {
      return
    }
    // Protected routes on main domain → redirect to dashboard subdomain
    if (hasToken) {
      return navigateTo(`https://${dashboardDomain}${to.path}`, { external: true })
    }
    return navigateTo(`https://${dashboardDomain}/auth/login`, { external: true })
  }

  // --- DASHBOARD SUBDOMAIN (dashboard.contentrich.nl) ---
  if (isDashboard) {
    if (to.path === '/') {
      return navigateTo('/dashboard')
    }
    if (isAuthRoute) {
      return
    }
    if (!hasToken) {
      return navigateTo('/auth/login')
    }
    return
  }

  // --- LOCAL DEV / FALLBACK ---
  if (isAuthRoute || isPublicRoute) {
    return
  }
  if (!hasToken) {
    return navigateTo('/auth/login')
  }
})
