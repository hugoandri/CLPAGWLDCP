import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1240px",
      },
    },
    extend: {
      colors: {
        // Verde césped — color principal de marca
        pitch: {
          DEFAULT: "#0BA14A",
          50: "#ECFBF1",
          100: "#CFF4DB",
          200: "#9FE7B7",
          300: "#5FD389",
          400: "#2DBC65",
          500: "#0BA14A",
          600: "#08823B",
          700: "#076A31",
          800: "#085327",
          900: "#073F1F",
        },
        // Azul medianoche — fondos oscuros, navegación, texto fuerte
        navy: {
          DEFAULT: "#0C1E33",
          700: "#16395C",
          800: "#102A45",
          900: "#0A1726",
          950: "#06101C",
        },
        // Dorado — acentos premium
        gold: {
          DEFAULT: "#F2B705",
          400: "#FFD23F",
          600: "#D49E00",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(12,30,51,0.06), 0 8px 24px -12px rgba(12,30,51,0.18)",
        "card-hover": "0 4px 8px rgba(12,30,51,0.08), 0 16px 40px -16px rgba(12,30,51,0.28)",
      },
      backgroundImage: {
        "pitch-lines":
          "repeating-linear-gradient(90deg, transparent, transparent 78px, rgba(255,255,255,0.05) 78px, rgba(255,255,255,0.05) 80px)",
      },
      keyframes: {
        "bar-grow": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseLive: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        "bar-grow": "bar-grow 0.9s cubic-bezier(0.22,1,0.36,1) forwards",
        "fade-up": "fade-up 0.5s ease-out both",
        "pulse-live": "pulseLive 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
