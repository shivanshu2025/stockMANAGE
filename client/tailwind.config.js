/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F9F9F9',
        primary: {
          DEFAULT: '#778667',
          light: '#95A389',
          dark: '#5E6B52',
        },
        dark: {
          DEFAULT: '#434D59',
          soft: '#5C6672',
          muted: '#8A929C',
        },
        line: '#E4E7E2',
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(67, 77, 89, 0.06), 0 1px 2px rgba(67, 77, 89, 0.04)',
      },
    },
  },
  plugins: [],
};
