/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8E7CC3',
        primaryDark: '#6d5b99',
        slateBrand: '#2D3748',
        textPrimary: '#1A202C',
        textSecondary: '#718096',
        bgAudvik: '#F4F2FB',
        sidebarBg: '#F8F9FD',
        borderAudvik: '#DAD5EC',
        borderDiv: '#E2E8F0',
        success: '#48BB78',
        warning: '#ED8936',
        error: '#F56565'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};