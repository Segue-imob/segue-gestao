/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        segue: {
          black: '#161912',
          cream: '#f8ede5',
          terracotta: '#a64324',
          stone: '#bfb8ae',
          brown: '#593825',
          // tons derivados para estados de hover/active/superfícies
          'black-soft': '#22261c',
          'terracotta-dark': '#8a3a1f',
          'terracotta-light': '#c96a45',
          'stone-light': '#ded9d1',
          'stone-pale': '#eeece7',
          'cream-dim': '#f0e3d8',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(22, 25, 18, 0.06), 0 1px 3px 0 rgba(22, 25, 18, 0.08)',
        panel: '0 10px 40px -12px rgba(22, 25, 18, 0.45)',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'slide-in': 'slideIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideIn: {
          '0%': { transform: 'translateX(16px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
