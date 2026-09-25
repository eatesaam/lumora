/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0B0B12', soft: '#15151F', muted: '#6B6B80' },
        brand: { DEFAULT: '#7C5CFF', dark: '#5B3FE0', light: '#EDE8FF' },
        coral: { DEFAULT: '#FF6B5B', light: '#FFE9E6' },
        teal: { DEFAULT: '#14B8A6', light: '#DDF7F3' },
        surface: { DEFAULT: '#FFFFFF', alt: '#F7F6FB' },
        line: '#E7E5F0',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { xl: '14px', '2xl': '18px' },
      boxShadow: { soft: '0 6px 24px rgba(20, 16, 50, 0.08)' },
      backgroundImage: {
        'gradient-header': 'linear-gradient(135deg, #7C5CFF 0%, #FF6B5B 100%)',
        'gradient-dark': 'linear-gradient(160deg, #15151F 0%, #0B0B12 100%)',
      },
    },
  },
  plugins: [],
};