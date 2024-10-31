/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        // Bạn có thể thêm custom theme ở đây
        colors: {
          // Ví dụ thêm màu tùy chỉnh
          'primary': '#1a73e8',
          'secondary': '#4285f4',
        },
        // Thêm breakpoints tùy chỉnh
        screens: {
          'tablet': '640px',
          'laptop': '1024px',
          'desktop': '1280px',
        },
      },
    },
    plugins: [],
  }