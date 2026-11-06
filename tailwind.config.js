const { AppColors } = require("./src/shared/theme/colors.ts");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        field: "hsl(var(--field))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          pressed: "hsl(var(--secondary-pressed))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
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
        // Legacy Themed* classNames (bg-light-background etc.) until RNR phase 1
        light: {
          primary: AppColors.light.primary,
          secondary: AppColors.light.secondary,
          tertiary: AppColors.light.tertiary,
          success: AppColors.light.success,
          text: AppColors.light.text,
          background: AppColors.light.background,
          card: AppColors.light.card,
          border: AppColors.light.border,
          muted: AppColors.light.muted,
        },
        dark: {
          primary: AppColors.dark.primary,
          secondary: AppColors.dark.secondary,
          tertiary: AppColors.dark.tertiary,
          success: AppColors.dark.success,
          text: AppColors.dark.text,
          background: AppColors.dark.background,
          card: AppColors.dark.card,
          border: AppColors.dark.border,
          muted: AppColors.dark.muted,
        },
      },
      borderRadius: {
        sm: "0.225rem",
        md: "0.3rem",
        lg: "var(--radius)",
        xl: "0.525rem",
        "2xl": "0.675rem",
        "3xl": "0.825rem",
        "4xl": "0.975rem",
      },
      fontFamily: {
        "figtree-regular": ["Figtree_400Regular", "sans-serif"],
        "figtree-medium": ["Figtree_500Medium", "sans-serif"],
        "figtree-semibold": ["Figtree_600SemiBold", "sans-serif"],
        "figtree-bold": ["Figtree_700Bold", "sans-serif"],
        "figtree-light": ["Figtree_300Light", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
