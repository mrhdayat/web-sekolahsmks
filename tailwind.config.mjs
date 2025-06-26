/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class', // atau 'media' jika Anda lebih suka berdasarkan preferensi OS
  theme: {
    extend: {
      animation: {
        'motion-typing': 'typewriter 2s steps(10) forwards, blink 1s steps(10) infinite 2s',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'zoom-in': 'zoomIn 0.8s ease-out forwards',
        'slide-left': 'slideLeft 0.8s ease-out forwards',
        'slide-right': 'slideRight 0.8s ease-out forwards',
        'bounce-subtle': 'bounceSubtle 1.5s infinite',
        'pop-subtle': 'popSubtle 0.3s ease-out forwards',
      },
      keyframes: {
        typewriter: {
          'to': { left: '100%' },
        },
        blink: {
          '0%': { 'border-right-color': 'transparent' },
          '50%': { 'border-right-color': 'currentColor' },
          '100%': { 'border-right-color': 'transparent' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        zoomIn: {
          '0%': { opacity: 0, transform: 'scale(0.9)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        slideLeft: {
          '0%': { opacity: 0, transform: 'translateX(20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: 0, transform: 'translateX(-20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        popSubtle: {
          '0%': { transform: 'scale(0.95)', opacity: 0.8 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        }
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
