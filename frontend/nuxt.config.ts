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
      title: 'Flowgent — AI Social Media Manager | contentrich.nl',
      meta: [
        { name: 'description', content: 'AI-powered social media management platform — Plan, create en publiceer content met AI' },
        { name: 'og:title', content: 'Flowgent — AI Social Media Manager' },
        { name: 'og:description', content: 'Plan, creëer en publiceer social media content met AI' },
        { name: 'og:type', content: 'website' },
        { name: 'og:url', content: 'https://contentrich.nl' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap' },
      ],
    },
  },
})
