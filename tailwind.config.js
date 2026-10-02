/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        palm: {
          50: '#effaf3',
          100: '#d8f2e1',
          200: '#b3e4c7',
          300: '#80cfa5',
          400: '#4bb37f',
          500: '#279763',
          600: '#18794e',
          700: '#146142',
          800: '#134d37',
          900: '#11402f',
          950: '#08241a',
        },
        date: {
          50: '#fbf6ee',
          100: '#f4e8d3',
          200: '#e8cfa5',
          300: '#dab070',
          400: '#cf954a',
          500: '#c27d36',
          600: '#a9622c',
          700: '#8c4a27',
          800: '#733d26',
          900: '#5f3322',
        },
        sand: {
          50: '#fdfcf9',
          100: '#faf7f0',
          200: '#f3ede0',
          300: '#e7dcc6',
        },
        ink: {
          DEFAULT: '#1b2420',
          soft: '#4b5853',
          mute: '#7c8984',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', '"Readex Pro"', 'system-ui', 'Segoe UI', 'Tahoma', 'sans-serif'],
        display: ['"Readex Pro"', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(17,64,47,.04), 0 8px 24px -8px rgba(17,64,47,.12)',
        lift: '0 2px 4px rgba(17,64,47,.06), 0 18px 40px -12px rgba(17,64,47,.25)',
        glow: '0 10px 30px -6px rgba(24,121,78,.55)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(.9) translateY(12px)' },
          '60%': { opacity: '1', transform: 'scale(1.02) translateY(-2px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        wobble: {
          '0%,100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-12deg)' },
          '75%': { transform: 'rotate(12deg)' },
        },
        'spin-dice': {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.15)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'reel-tick': {
          '0%': { transform: 'translateY(-40%)', opacity: '0', filter: 'blur(2px)' },
          '100%': { transform: 'translateY(0)', opacity: '1', filter: 'blur(0)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(.6)', opacity: '0' },
          '70%': { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'pop-in': 'pop-in .55s cubic-bezier(.2,.9,.3,1.2) both',
        'fade-up': 'fade-up .4s ease-out both',
        wobble: 'wobble .5s ease-in-out',
        'spin-dice': 'spin-dice .6s linear infinite',
        shimmer: 'shimmer 1.4s linear infinite',
        float: 'float 3s ease-in-out infinite',
        'slide-up': 'slide-up .3s cubic-bezier(.2,.9,.3,1) both',
        'reel-tick': 'reel-tick .12s ease-out both',
        'bounce-in': 'bounceIn .45s cubic-bezier(.2,.9,.3,1.3) both',
      },
    },
  },
  plugins: [],
};
