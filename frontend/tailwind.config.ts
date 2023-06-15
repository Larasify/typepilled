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
    },
  },
  plugins: [require("daisyui")],
  daisyui:{
    base:false,
  },
} satisfies Config;
