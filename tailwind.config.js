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
          50: '#F2EEE5', // Light Beige
          100: '#FAF9F5', // Warm White
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#0B3D2E', // Deep Saudi Green
          700: '#062A20', // Dark Green
          800: '#041f17',
          900: '#02120d',
          950: '#010a07',
        },
        gold: {
          light: '#E2C47A', // Light Gold Glow
          DEFAULT: '#C6A15B', // Luxury Gold
          dark: '#b39050',
        },
        surface: {
          dark: '#062A20',
          card: '#0B3D2E',
          border: 'rgba(198, 161, 91, 0.15)', // Gold border
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
