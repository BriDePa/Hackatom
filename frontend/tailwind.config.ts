import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        carbon: "#07110f",
        panel: "#0c1a17",
        bio: "#57ff9a",
        ion: "#45d9ff",
        warning: "#f6c85f",
        danger: "#ff5f7a",
      },
      boxShadow: {
        glow: "0 0 32px rgba(87, 255, 154, 0.22)",
      },
    },
  },
  plugins: [],
} satisfies Config;
