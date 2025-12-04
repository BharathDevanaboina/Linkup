
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
        colors: {
            black: '#050505',
            zinc: {
                800: '#27272a',
                900: '#18181b',
                950: '#09090b',
            },
            violet: {
                500: '#8b5cf6',
                600: '#6A4CFF',
                700: '#5b21b6',
            }
        },
        animation: {
            'spin-slow': 'spin 8s linear infinite',
            'float': 'float 6s ease-in-out infinite',
        },
        keyframes: {
            float: {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-10px)' },
            }
        }
    },
  },
  plugins: [],
}
