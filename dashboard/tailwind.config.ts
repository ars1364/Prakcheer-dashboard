import type { Config } from "tailwindcss";

// Prakcheer Design System — color tokens derived from the logo's 60-30-10 rule.
// Logo colors (white bg excluded): light-blue cloud (#BFDBFE), mid-blue cloud (#4A8FE0), deep-blue sphere (#1A4FD6).
// 60% → light blue surfaces | 30% → mid blue structure | 10% → deep blue accent

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 60% — dominant background tones (light blue, not pure white)
        bg: {
          DEFAULT: "#EFF6FF",   // blue-50: primary page background
          subtle: "#DBEAFE",    // blue-100: subtle surface variant
          card:   "#FFFFFF",    // pure white for cards (floats above bg)
        },
        // 30% — structural / secondary surfaces
        surface: {
          DEFAULT: "#BFDBFE",   // blue-200: sidebar active, panel bg
          hover:   "#93C5FD",   // blue-300: hover state on secondary
          muted:   "#E0EFFE",   // between 100–200: input bg, table rows
        },
        // 10% — accent / primary action
        primary: {
          DEFAULT: "#1D4ED8",   // blue-700: CTA, active nav, links
          hover:   "#1E40AF",   // blue-800: hover on primary
          light:   "#DBEAFE",   // blue-100: tint bg for badges/chips
          text:    "#1E3A8A",   // blue-900: text on primary-light surface
        },
        // Neutrals (cool blue-gray to stay in palette)
        text: {
          main:    "#0F172A",   // slate-900: headings, body
          muted:   "#475569",   // slate-600: secondary text, labels
          placeholder: "#94A3B8", // slate-400
          inverse: "#FFFFFF",
        },
        border: {
          DEFAULT: "#BFDBFE",   // blue-200
          strong:  "#93C5FD",   // blue-300
        },
        // Status colors — kept to a minimum
        success: { DEFAULT: "#16A34A", light: "#DCFCE7" },
        warning: { DEFAULT: "#D97706", light: "#FEF3C7" },
        danger:  { DEFAULT: "#DC2626", light: "#FEE2E2" },
      },
      fontFamily: {
        // Vazirmatn for Farsi/Latin — set via CSS variable in layout
        sans: ["var(--font-vazirmatn)", "Vazirmatn", "ui-sans-serif", "system-ui"],
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
        card:  "0 1px 4px 0 rgba(29,78,216,0.06), 0 0 0 1px rgba(191,219,254,0.5)",
        panel: "0 2px 12px 0 rgba(29,78,216,0.08)",
        focus: "0 0 0 3px rgba(29,78,216,0.20)",
      },
      spacing: {
        "4":  "4px",
        "8":  "8px",
        "12": "12px",
        "16": "16px",
        "20": "20px",
        "24": "24px",
        "32": "32px",
        "40": "40px",
        "48": "48px",
        "56": "56px",
        "64": "64px",
      },
    },
  },
  plugins: [],
};
export default config;
