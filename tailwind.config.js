/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saudi: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#006C35', // Authentic Saudi Green
          700: '#0c522b',
          800: '#0c3d22',
          900: '#062615',
          950: '#03140b',
        },
        surface: {
          dark: '#080e0a',
          card: '#0f1812',
          border: 'rgba(34, 197, 94, 0.15)',
        }
      },
      fontFamily: {
        arabic: ['Readex Pro', 'Tajawal', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2.5s ease-in-out infinite alternate',
        'wave': 'wave 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(0, 108, 53, 0.4), 0 0 30px rgba(16, 185, 129, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(0, 108, 53, 0.7), 0 0 50px rgba(16, 185, 129, 0.4)' },
        },
        wave: {
          '0%': { transform: 'scaleY(0.4)' },
          '100%': { transform: 'scaleY(1.1)' }
        }
      }
    },
  },
  plugins: [],
}
