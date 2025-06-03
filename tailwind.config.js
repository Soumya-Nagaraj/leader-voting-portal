/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      colors: {
        fire: {
          50: '#FFF5ED',
          100: '#FFE9D4',
          200: '#FFCFA8',
          300: '#FFAD7A',
          400: '#FF8A4C',
          500: '#F97316', // Primary
          600: '#EA580C', // Darker
          700: '#C2410C', // Even darker
          800: '#9A3412', 
          900: '#7C2D12',
          950: '#431407',
        },
        ember: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24', // Primary
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
        flame: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C', // Primary
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A',
        },
        ash: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
      },
      keyframes: {
        'flame-flicker': {
          '0%, 100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '25%': { opacity: '0.9', transform: 'translateY(-1px) scale(1.01)' },
          '50%': { opacity: '0.95', transform: 'translateY(1px) scale(0.99)' },
          '75%': { opacity: '0.85', transform: 'translateY(-0.5px) scale(1.02)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px 2px rgba(249, 115, 22, 0.3)' },
          '50%': { boxShadow: '0 0 15px 5px rgba(249, 115, 22, 0.5)' },
        }
      },
      animation: {
        'flame-flicker': 'flame-flicker 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      boxShadow: {
        'glow-sm': '0 0 5px 0 rgba(249, 115, 22, 0.3)',
        'glow': '0 0 10px 0 rgba(249, 115, 22, 0.5)',
        'glow-lg': '0 0 20px 0 rgba(249, 115, 22, 0.7)',
      },
    },
  },
  plugins: [],
};