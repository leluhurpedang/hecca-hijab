/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FDFCF9',
          100: '#FAF7F2',
          200: '#F4EFEB',
          300: '#EAE2D8',
          400: '#DECEBF',
        },
        sand: {
          100: '#EFE9E4',
          200: '#E3D7CC',
          300: '#D1BFB0',
          400: '#B59E8C',
        },
        mocha: {
          100: '#F0E8E1',
          200: '#DDCFC4',
          300: '#C4AE9F',
          400: '#A88B77',
          500: '#8C6D58',
          600: '#755845',
          700: '#5C4334',
          800: '#443125',
          900: '#2C1F17',
        },
        espresso: {
          800: '#38302A',
          900: '#211D1A',
          950: '#151210',
        },
        gold: {
          300: '#E6CF8B',
          400: '#D4AF37',
          500: '#C29C23',
        }
      },
      screens: {
        'xs': '360px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(33, 29, 26, 0.05)',
        'card': '0 6px 24px -4px rgba(33, 29, 26, 0.08)',
        'dropdown': '0 10px 30px -5px rgba(33, 29, 26, 0.12)',
      }
    },
  },
  plugins: [],
}

