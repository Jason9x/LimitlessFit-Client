/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif']
      },
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
        'text-primary': {
          DEFAULT: '#212529',
          dark: '#FFFFFF'
        },
        'text-secondary': {
          DEFAULT: '#6c757d',
          dark: '#171717'
        },
        link: {
          DEFAULT: '#4B51F4',
          dark: '#5884F6'
        }
      }
    }
  },
  darkMode: 'class',
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('@designbycode/tailwindcss-text-shadow')]
}
