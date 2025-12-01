import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'toast-in': 'toast-in 0.3s ease-out',
        'toast-out': 'toast-out 0.3s ease-in',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'snow': 'snow linear infinite',
        'logo-fade-in': 'logo-fade-in 5s ease-out 3s forwards',
        'background-fade-in': 'background-fade-in 3s ease-out forwards',
      },
      keyframes: {
        'toast-in': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'toast-out': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-100%)', opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'snow': {
          '0%': {
            transform: 'translateY(0) translateX(0) rotate(0deg)',
          },
          '50%': {
            transform: 'translateY(50vh) translateX(var(--drift, 50px)) rotate(180deg)',
          },
          '100%': {
            transform: 'translateY(100vh) translateX(0) rotate(360deg)',
          },
        },
        'logo-fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'background-fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [],
}
export default config

