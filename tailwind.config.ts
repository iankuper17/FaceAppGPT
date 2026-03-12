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
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "rgba(255, 255, 255, 0.04)",
          hover: "rgba(255, 255, 255, 0.07)",
          active: "rgba(255, 255, 255, 0.10)",
          border: "rgba(255, 255, 255, 0.08)",
          "border-hover": "rgba(255, 255, 255, 0.14)",
        },
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.06)",
          heavy: "rgba(255, 255, 255, 0.10)",
          border: "rgba(255, 255, 255, 0.12)",
          highlight: "rgba(255, 255, 255, 0.15)",
          glow: "rgba(255, 255, 255, 0.05)",
        },
        plum: {
          950: "#08050f",
          900: "#0f0a1a",
          800: "#1a0a2e",
          700: "#2d1254",
          600: "#44197a",
        },
        graphite: {
          950: "#08080c",
          900: "#0d0d12",
          800: "#14141c",
          700: "#1c1c28",
          600: "#24243a",
        },
        ig: {
          violet: "#7c3aed",
          purple: "#9333ea",
          magenta: "#c026d3",
          pink: "#ec4899",
          coral: "#f43f5e",
          orange: "#f97316",
          gold: "#eab308",
        },
      },
      backdropBlur: {
        glass: "16px",
        "glass-heavy": "32px",
        "glass-xl": "48px",
      },
      borderRadius: {
        glass: "20px",
        "glass-lg": "28px",
        "glass-xl": "36px",
      },
      boxShadow: {
        glass: "0 0 0 1px rgba(255, 255, 255, 0.08), 0 8px 32px rgba(0, 0, 0, 0.4)",
        "glass-lg": "0 0 0 1px rgba(255, 255, 255, 0.08), 0 16px 48px rgba(0, 0, 0, 0.5)",
        "glass-glow": "0 0 0 1px rgba(255, 255, 255, 0.10), 0 0 40px rgba(124, 58, 237, 0.15), 0 8px 32px rgba(0, 0, 0, 0.4)",
        "glass-glow-lg": "0 0 0 1px rgba(255, 255, 255, 0.10), 0 0 60px rgba(192, 38, 211, 0.2), 0 16px 48px rgba(0, 0, 0, 0.5)",
        "ig-glow": "0 0 40px rgba(192, 38, 211, 0.3), 0 0 80px rgba(124, 58, 237, 0.15)",
        "ig-glow-sm": "0 0 20px rgba(192, 38, 211, 0.2), 0 0 40px rgba(124, 58, 237, 0.1)",
        soft: "0 4px 24px rgba(0, 0, 0, 0.3)",
        "soft-lg": "0 8px 40px rgba(0, 0, 0, 0.4)",
      },
      backgroundImage: {
        "ig-gradient": "linear-gradient(135deg, #7c3aed 0%, #9333ea 20%, #c026d3 40%, #ec4899 60%, #f43f5e 80%, #f97316 100%)",
        "ig-gradient-subtle": "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(192,38,211,0.15) 50%, rgba(249,115,22,0.15) 100%)",
        "ig-gradient-vertical": "linear-gradient(180deg, #7c3aed 0%, #c026d3 50%, #f97316 100%)",
        "glass-shine": "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.05) 100%)",
        "body-gradient": "radial-gradient(ellipse at 50% 0%, #1a0a2e 0%, #0d0d12 40%, #08080c 100%)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 6vw, 5rem)", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display": ["clamp(2.25rem, 4.5vw, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "700" }],
        "display-sm": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "600" }],
        "title": ["clamp(1.25rem, 2vw, 1.5rem)", { lineHeight: "1.25", letterSpacing: "-0.015em", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "caption": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        "micro": ["0.75rem", { lineHeight: "1.4", fontWeight: "500" }],
      },
      spacing: {
        "safe-bottom": "env(safe-area-inset-bottom, 0px)",
      },
      animation: {
        "ambient-float": "ambientFloat 60s ease-in-out infinite",
        "ambient-float-delay": "ambientFloat 60s ease-in-out 20s infinite",
        "ambient-float-slow": "ambientFloat 80s ease-in-out 40s infinite",
        "gradient-flow": "gradientFlow 3s ease infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "score-reveal": "scoreReveal 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      },
      keyframes: {
        ambientFloat: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(30px, -50px) scale(1.1)" },
          "50%": { transform: "translate(-20px, 20px) scale(0.95)" },
          "75%": { transform: "translate(40px, 30px) scale(1.05)" },
        },
        gradientFlow: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        scoreReveal: {
          from: { opacity: "0", transform: "scale(0.7)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
