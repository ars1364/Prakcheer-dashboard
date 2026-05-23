import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Page / shell background
        bg: {
          DEFAULT: "#f7faff",   // very-light blue-tinted page bg
          card:    "#ffffff",   // white card surface
          muted:   "#f0f6ff",   // table zebra, input bg
        },
        // Brand / primary (10%)
        brand: {
          DEFAULT: "#2554d8",
          hover:   "#1e3fa8",
          light:   "#eaf2ff",   // tint bg for chips, active sidebar
          subtle:  "#dbeafe",   // gradient end for active sidebar
        },
        // Text
        text: {
          main:        "#111827",
          muted:       "#64748b",
          placeholder: "#94a3b8",
          inverse:     "#ffffff",
        },
        // Borders — softer, less saturated
        border: {
          DEFAULT: "#dbe7f7",
          strong:  "#b9d2f2",
        },
        // Status
        success: { DEFAULT: "#16a34a", light: "#dcfce7", text: "#14532d" },
        warning: { DEFAULT: "#d97706", light: "#fef3c7", text: "#78350f" },
        danger:  { DEFAULT: "#dc2626", light: "#fee2e2", text: "#7f1d1d" },
      },
      fontFamily: {
        sans: ["var(--font-vazirmatn)", "Vazirmatn", "ui-sans-serif", "system-ui"],
      },
      // Pixel-exact spacing overrides (these replace the rem defaults for these keys)
      spacing: {
        "1":  "1px",
        "2":  "2px",
        "4":  "4px",
        "6":  "6px",
        "7":  "7px",
        "8":  "8px",
        "9":  "9px",
        "10": "10px",
        "12": "12px",
        "14": "14px",
        "16": "16px",
        "18": "18px",
        "20": "20px",
        "24": "24px",
        "28": "28px",
        "32": "32px",
        "34": "34px",
        "36": "36px",
        "40": "40px",
        "44": "44px",
        "48": "48px",
        "56": "56px",
        "60": "60px",
        "64": "64px",
        "80": "80px",
        "96": "96px",
      },
      borderRadius: {
        "4":  "4px",
        "6":  "6px",
        "8":  "8px",
        "12": "12px",
        "16": "16px",
        "20": "20px",
        "24": "24px",
        "999": "999px",
      },
      boxShadow: {
        card:  "0 1px 3px 0 rgba(15,23,42,0.04), 0 0 0 1px #dbe7f7",
        panel: "0 8px 24px 0 rgba(15,23,42,0.04)",
        focus: "0 0 0 3px rgba(37,84,216,0.18)",
      },
    },
  },
  plugins: [],
};
export default config;
