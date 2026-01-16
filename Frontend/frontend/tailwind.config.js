/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../index.html",
    "../index.tsx"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8E7CC3',
        primaryDark: '#5E5280', 
        slateBrand: '#2D3748',
        bgAudvik: '#F8F9FD',
        borderAudvik: '#E2E8F0',
        borderDiv: '#E5E7EB',
        textPrimary: '#111827',
        textSecondary: '#6B7280',
        sidebarBg: '#FFFFFF',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B'
      }
    },
  },
  plugins: [],
}