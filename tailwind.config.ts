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
        },
        'order-status': {
          pending: {
            background: {
              DEFAULT: '#BDB2FF',
              dark: '#1E2777'
            },
            text: {
              DEFAULT: '#4B51F4',
              dark: '#5884F6'
            }
          },
          processing: {
            background: {
              DEFAULT: '#FFFFBF',
              dark: '#FFFF80'
            },
            text: {
              DEFAULT: '#DAA520',
              dark: '#8B8000'
            }
          },
          shipping: {
            background: {
              DEFAULT: '#FFA0B1',
              dark: '#730F0F'
            },
            text: {
              DEFAULT: '#DD293F',
              dark: '#FF351A'
            }
          },
          delivered: {
            background: {
              DEFAULT: '#9AEDC5',
              dark: '#314C4E'
            },
            text: {
              DEFAULT: '#25B87B',
              dark: '#49B496'
            }
          }
        }
      }
    }
  },
  plugins: [textShadowPlugin]
} satisfies Config
