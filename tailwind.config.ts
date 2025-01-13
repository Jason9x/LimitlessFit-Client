import type { Config } from 'tailwindcss'
import textShadowPlugin from '@designbycode/tailwindcss-text-shadow'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FE9381',
          dark: '#E51A1A'
        },
        secondary: {
          DEFAULT: '#F2F2F2',
          dark: '#171717'
        },
        background: {
          DEFAULT: '#FFFFFF',
          dark: '#232222'
        },
        foreground: {
          DEFAULT: '#212529',
          dark: '#FFFFFF'
        },
        'foreground-secondary': {
          DEFAULT: '#5D5D5D',
          dark: '#BEBEBE'
        },
        link: {
          DEFAULT: '#4B51F4',
          dark: '#5884F6'
        }
      }
    }
  },
  plugins: [textShadowPlugin]
} satisfies Config
