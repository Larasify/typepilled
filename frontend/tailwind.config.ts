import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  important: true,
  theme: {
    extend: {
      colors: {
        "primary-color": "#e2b714",
        "background-color": "#323437",
        "sub-color": "#646669",
        "sub-alt-color": "#2c2e31",
        "text-color": "#d1d0c5",
      },
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui:{
    base:false,
  },
} satisfies Config;
