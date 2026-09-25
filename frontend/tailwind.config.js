/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        polar: {
          950: '#040711',
          900: '#080d1a',
          850: '#0b1326',
          800: '#0f1b33',
          750: '#142342',
          700: '#1c2e54',
          600: '#284177',
          500: '#385ea8',
        },
        ice: {
          cyan: '#00f0ff',
          neon: '#38bdf8',
          glow: '#7dd3fc',
          muted: '#94a3b8',
        },
        risk: {
          safe: '#10b981',
          low: '#eab308',
          moderate: '#f97316',
          high: '#ef4444',
          extreme: '#881337',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Menlo', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)' },
          '50%': { boxShadow: '0 0 25px rgba(0, 240, 255, 0.8)' },
        }
      },
      animation: {
        'pulse-slow': 'pulseSlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
