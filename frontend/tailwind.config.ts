import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-color": "#e2b714",
        "background-color": "#323437",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui:{
    base:false,
  },
} satisfies Config;
