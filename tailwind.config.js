/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E72BD',
          light: '#4A9AD8',
          dark: '#15589A',
        },
        secondary: {
          DEFAULT: '#E6F0FA',
          light: '#F3F8FD',
        },
        accent: {
          DEFAULT: '#F3F3F3',
        },
        error: '#E74C3C',
        success: '#27AE60',
        warning: '#F39C12',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Arial', 'sans-serif'],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'xxl': '48px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
    },
  },
  plugins: [],
}
