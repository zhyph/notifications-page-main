/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "c-red": "hsl(1, 90%, 64%)",
        "c-blue": "hsl(219, 85%, 26%)",
        "c-white": "hsl(0, 0%, 100%)",
        "c-very-light-grayish-blue": "hsl(210, 60%, 98%)",
        "c-light-grayish-blue-1": "hsl(211, 68%, 94%)",
        "c-light-grayish-blue-2": "hsl(205, 33%, 90%)",
        "c-grayish-blue": "hsl(219, 14%, 63%)",
        "c-dark-grayish-blue": "hsl(219, 12%, 42%)",
        "c-very-dark-blue": "hsl(224, 21%, 14%)"
      }
    },
  },
  plugins: [],
}