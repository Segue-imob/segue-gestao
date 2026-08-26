/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        segue: {
          950: '#0A1128',
          900: '#0E1B3D',
          800: '#132A5E',
          700: '#1B3A7A',
          600: '#254B96',
          500: '#2F5FB8',
          400: '#4E7FD6',
          accent: '#F5A623',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(14, 27, 61, 0.06), 0 1px 3px 0 rgba(14, 27, 61, 0.08)',
        panel: '0 10px 40px -12px rgba(14, 27, 61, 0.35)',
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
