/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Brutalisme Moderne - Dark Theme
        'brutal-black': '#050505',
        'brutal-dark': '#0F0F0F',
        'brutal-white': '#FFFFFF',
        'brutal-accent': '#FF3333',
        'brutal-neon': '#00FF88',
        'brutal-gray': '#1A1A1A',
        'brutal-border': '#2A2A2A',
      },
      fontFamily: {
        'grotesk': ['Space Grotesk', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'brutal-xs': ['0.75rem', { lineHeight: '1rem' }],
        'brutal-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'brutal-base': ['1rem', { lineHeight: '1.5rem' }],
        'brutal-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'brutal-xl': ['1.25rem', { lineHeight: '1.75rem' }],
        'brutal-2xl': ['1.5rem', { lineHeight: '2rem' }],
        'brutal-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        'brutal-4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        'brutal-5xl': ['3rem', { lineHeight: '1' }],
        'brutal-6xl': ['3.75rem', { lineHeight: '1' }],
        'brutal-7xl': ['4.5rem', { lineHeight: '1' }],
      },
      spacing: {
        'brutal-xs': '0.5rem',
        'brutal-sm': '1rem',
        'brutal-md': '1.5rem',
        'brutal-lg': '2rem',
        'brutal-xl': '3rem',
        'brutal-2xl': '4rem',
        'brutal-3xl': '6rem',
      },
      borderWidth: {
        'brutal': '2px',
        'brutal-thick': '4px',
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(255, 255, 255, 0.1)',
        'brutal-accent': '4px 4px 0px 0px rgba(255, 51, 51, 0.5)',
        'brutal-neon': '4px 4px 0px 0px rgba(0, 255, 136, 0.5)',
        'brutal-lg': '8px 8px 0px 0px rgba(255, 255, 255, 0.1)',
        'brutal-xl': '12px 12px 0px 0px rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'brutal-pulse': 'brutal-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'brutal-bounce': 'brutal-bounce 1s ease-in-out infinite',
        'brutal-slide-up': 'brutal-slide-up 0.5s ease-out',
        'brutal-slide-down': 'brutal-slide-down 0.5s ease-out',
        'brutal-fade-in': 'brutal-fade-in 0.3s ease-in',
      },
      keyframes: {
        'brutal-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'brutal-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'brutal-slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'brutal-slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'brutal-fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
