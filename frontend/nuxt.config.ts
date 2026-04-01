export default defineNuxtConfig({
  devtools: { enabled: false },
  builder: 'vite',
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
  ],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:4000',
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_KEY || '',
    },
  },
  colorMode: {
    classSuffix: '',
  },
  tailwindcss: {
    configPath: 'tailwind.config.ts',
  },
  app: {
    head: {
      title: 'ContentRich — AI Social Media Management | contentrich.nl',
      meta: [
        { name: 'description', content: 'AI-powered social media management platform — Plan, create and publish content with AI. For agencies, brands, and marketers.' },
        { name: 'og:title', content: 'ContentRich — AI Social Media Management' },
        { name: 'og:description', content: 'The easiest way to manage and grow your social channels. Plan, create and publish content with AI.' },
        { name: 'og:type', content: 'website' },
        { name: 'og:url', content: 'https://contentrich.nl' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      script: [
        { src: 'https://accounts.google.com/gsi/client', async: true, defer: true },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap' },
      ],
    },
  },
})
