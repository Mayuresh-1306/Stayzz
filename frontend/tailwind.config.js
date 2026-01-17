module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ef4444',
        secondary: '#6b7280',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      boxShadow: {
        custom: '0 10px 25px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
