/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  important: true,
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'comic': ['"Comic Neue"', 'cursive'],
        'stack': ['"Short Stack"', 'cursive'],
      },
      colors: {
        primary: '#2A9D8F',
        'primary-dark': '#247E74',
        cream: '#FDF6E9',
        coral: '#E76F51',
        'coral-dark': '#D65F41',
        teal: {
          400: '#4FD1C5',
          500: '#38B2AC',
          600: '#319795',
        },
        dark: {
          DEFAULT: '#1F2937',
          light: '#374151',
        },
      },
      fontSize: {
        'xl': ['1.25rem', {
          lineHeight: '1.8',
          letterSpacing: '0.01em',
        }],
      },
      spacing: {
        '18': '4.5rem',
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.15)',
      },
      backgroundImage: {
        'floral-corner': "url('/images/floral-corner.png')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
  // Don't purge Ionic classes
  safelist: [
    {
      pattern: /^ion-/,
    },
    {
      pattern: /^md-/,
    },
    {
      pattern: /^ios-/,
    },
    // Add common Tailwind classes that might be used dynamically
    'bg-white',
    'dark:bg-gray-900',
    'text-gray-800',
    'dark:text-gray-200',
  ],
} 