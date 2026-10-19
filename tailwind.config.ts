import type { Config } from "tailwindcss";

export default {
  darkMode: ["variant", ["&:is(.dark *)", '&:is([data-theme="dark"] *)']],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Michroma", "Geist", "sans-serif"],
        // Chronus has two families only; mono-styled values use Geist with tabular figures.
        mono: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        engineering: {
          DEFAULT: "hsl(var(--engineering))",
          foreground: "hsl(var(--engineering-foreground))",
          muted: "hsl(var(--engineering-muted))",
        },
        operational: {
          DEFAULT: "hsl(var(--operational))",
          foreground: "hsl(var(--operational-foreground))",
          muted: "hsl(var(--operational-muted))",
        },
        gap: {
          DEFAULT: "hsl(var(--gap))",
          foreground: "hsl(var(--gap-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))", foreground: "hsl(var(--success-foreground))",
          badge: "var(--feedback-success-badge)", surface: "var(--feedback-success-background)",
        },
        info: {
          DEFAULT: "hsl(var(--info))", foreground: "hsl(var(--info-foreground))",
          badge: "var(--feedback-info-badge)", surface: "var(--feedback-info-background)",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))", foreground: "hsl(var(--warning-foreground))",
          badge: "var(--feedback-warning-badge)", surface: "var(--feedback-warning-background)",
        },
        error: {
          DEFAULT: "hsl(var(--destructive))",
          badge: "var(--feedback-error-badge)", surface: "var(--feedback-error-background)",
        },
        neutral: {
          DEFAULT: "var(--feedback-neutral-content)",
          badge: "var(--feedback-neutral-badge)", surface: "var(--feedback-neutral-background)",
        },
        badge: "var(--feedback-badge-content)",

        // Chronus surface ladder: page -> container -> raised -> action -> raised-2
        page: "var(--surface-page-background)",
        container: "var(--surface-container)",
        raised: { DEFAULT: "var(--surface-raised)", 2: "var(--surface-raised-x2)" },
        action: {
          DEFAULT: "var(--surface-action)",
          primary: "var(--action-primary-default)",
          "primary-hover": "var(--action-primary-hover)",
          "primary-disabled": "var(--action-primary-disabled)",
        },
        // Text hierarchy beyond foreground / muted-foreground
        tertiary: "var(--text-tertiary)",
        quaternary: "var(--text-quaternary)",
        // Icons are greyscale and share the text tokens (text-icon-*).
        icon: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          quaternary: "var(--text-quaternary)",
        },
        "on-color": "var(--text-on-color)",
        // Chart series
        series: {
          1: "var(--analytics-series-1)", 2: "var(--analytics-series-2)", 3: "var(--analytics-series-3)",
          4: "var(--analytics-series-4)", 5: "var(--analytics-series-5)", 6: "var(--analytics-series-6)",
        },
        "surface-elevated": "hsl(var(--surface-elevated))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      // Chronus strokes: border-hairline (default divider), border-strong (hover), ring-active (focus)
      borderColor: {
        hairline: "var(--stroke-muted)",
        strong: "var(--stroke-default)",
      },
      ringColor: {
        active: "var(--stroke-active)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "flow-right": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "flow-right": "flow-right 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
