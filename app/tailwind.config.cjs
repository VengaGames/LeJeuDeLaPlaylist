/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "media",
  content: ["./src/**/*.js", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "540px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      print: { raw: "print" },
    },
    extend: {
      fontFamily: {
        montserrat: "Montserrat, sans-serif",
        poppins: ["Poppins", "sans-serif"],
      },
      fontSize: {
        minOption: "0.562rem", // 9px
        min: "0.687rem", // 11px
        med: "0.75rem", // 12px
        normal: "0.8125rem", // 13px
        normalPlus: "1rem", // 13px
        big: "1.687rem", // 27px
      },
      colors: {
        "regal-purple": "#ab63a3",
        primary: {
          DEFAULT: "#5abccd",
          50: "#f0f6f6",
          100: "#d4f0f6",
          200: "#a3e4eb",
          300: "#5abccd", // <-- primary
          400: "#31a8b0",
          500: "#238a90",
          600: "#1f7275",
          700: "#1c575c",
          800: "#153b43",
          900: "#0e252f",
        },
      },
      boxShadow: {
        default: "0px 0px 8px #00000014",
        db: "0px 0px 8px #0000001F", // delete and save buttpn
        dropDown: "0px 0px 8px #00000029", // select-dropdown
        header: "0px 3px 6px #00000014", // header box shadow
        button: "0px -3px 8px #00000014", // button box shadow
        sider: "2px 0px 7px #00000034", // sider box shadow
        secondary: "0px 3px 13px #0000002E", // columns in pages
        filter: "0px 10px 100px #0000004D", // Filter component
        filterBtn: "0px -1px 6px #00000029", // Bottom filter button
        popoverShadow: "0px 3px 6px #00000029", // Popover shadow
        slip: "0px 0px 4px #0000001A",
        box: "0px 0px 6px #0000001A",
        subHead: "-2px 3px 6px #00000012",
        deleteBtn: "0 0 6px #00000029",
        down: "0 5px 5px -5px #00000014",
        down2: "0 5px 5px -10px #00000014",
        down3: "0 5px 20px -5px #00000014",
      },
    },
  },
  variants: {
    extend: {},
  },
};
