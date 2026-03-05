/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Aleo', 'sans-serif'],
        'serif': ['"Patua One"', 'serif'],
      },
      colors: {
        caborca: {
          cafe: '#332B1E',  // Dark Coffee (Nosotros/Index HTML)
          negro: '#262F29', // Dark Grey/Black (Nosotros/Index HTML)
          'beige-suave': '#E8DCC4', // Global CSS Default
          'beige-fuerte': '#9B8674', // Cafe Suave (User manual override)
          arena: '#D2B48C', // Warm Sand (CSS)
          bronce: '#B8935F', // Aged Bronze/Gold (CSS)
          verde: '#34433B', // Deep Forest Green (CSS)
          'beige-muy-suave': '#d8a43b',
        },
        spacing: {
          'header-sm': '5rem'
        },
      },
    },
  },
  plugins: [],
}
