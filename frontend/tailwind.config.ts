import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#fafafa",
        ink: "#1a1a1a",
        inkLight: "#6b6b6b",
        stroke: "#1a1a1a",
        strokeLight: "#d4d4d4",
        indicator: {
          accent: "#2563eb",
          loss: "#dc2626",
          savings: "#16a34a",
          warning: "#d97706",
        },
      },
      boxShadow: {
        sketch: "0 2px 12px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
} satisfies Config;
