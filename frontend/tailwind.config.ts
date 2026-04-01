import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#e0efff',
          200: '#c7dffe',
          300: '#a5cbfc',
          400: '#549aee',
          500: '#1972f5',
          600: '#146ef5',
          700: '#005fd0',
          800: '#0388fc',
          900: '#000d21',
          950: '#100f0f',
        },
        sidebar: {
          bg: '#0f172a',
          hover: '#1e293b',
          active: '#334155',
          text: '#94a3b8',
          'text-active': '#f8fafc',
        },
        cs: {
          blue: '#1972f5',
          'blue-dark': '#005fd0',
          'blue-light': '#e2f2ff',
          'blue-lighter': '#fafcff',
          heading: '#1c1e20',
          body: '#363c48',
          muted: '#757575',
          border: '#e6e9ed',
          'bg-light': '#f2f4f6',
          'bg-card': '#ffffff',
          footer: '#171717',
          'footer-text': '#b0b0b0',
        },
      },
      borderRadius: {
        '4xl': '2rem',
        'pill': '100px',
      },
      animation: {
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'float-delayed': 'float-delayed 10s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(30px, -30px)' },
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-20px, 20px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
} satisfies Config
