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
      fontFamily: {
        'roboto': ['Roboto Mono', 'monospace'],
      },
      fontSize: {
        'gamesize': '1.65rem',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    base: false,
    themes: [
      {
        monkey: {
          "primary": "#e2b714",
          "secondary": "#d1d0c5",
          "accent": "#2c2e31",
          "neutral": "#646669",
          "base-100": "#323437",
        },
      },
      "dark",
      "cupcake",
      "synthwave",
      "bumblebee"

    ],
  },
} satisfies Config;
