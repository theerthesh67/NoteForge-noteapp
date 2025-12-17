import type { Config } from 'tailwindcss'

export default {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base colors - Deep charcoal with warm undertones
        ink: {
          950: '#0a0a0a',
          900: '#0f0f0f',
          850: '#161616',
          800: '#1c1c1c',
          700: '#242424',
          600: '#2a2a2a',
          500: '#333333',
          400: '#404040',
          300: '#525252',
        },
        // Accent colors - Warm amber/gold
        amber: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#92400e',
          muted: 'rgba(245, 158, 11, 0.15)',
        },
        // Text colors
        text: {
          primary: '#fafafa',
          secondary: '#a3a3a3',
          muted: '#737373',
          accent: '#fcd34d',
        },
        // Status colors
        status: {
          active: '#22c55e',
          'on-hold': '#f59e0b',
          completed: '#3b82f6',
          dropped: '#6b7280',
        }
      },
      fontFamily: {
        sans: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'SF Mono',
          'Menlo',
          'Consolas',
          'Liberation Mono',
          'monospace'
        ]
      },
      boxShadow: {
        'glow': '0 0 20px rgba(245, 158, 11, 0.15)',
        'glow-lg': '0 0 30px rgba(245, 158, 11, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in': 'slideIn 0.2s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(245, 158, 11, 0.15)' },
          '50%': { boxShadow: '0 0 20px 4px rgba(245, 158, 11, 0.15)' },
        },
      },
    }
  },
  plugins: []
} satisfies Config
