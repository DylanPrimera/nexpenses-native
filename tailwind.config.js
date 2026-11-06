const { AppColors } = require("./src/shared/theme/colors.ts");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
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
      fontFamily: {
        "figtree-regular": ["Figtree_400Regular", "sans-serif"],
        "figtree-medium": ["Figtree_500Medium", "sans-serif"],
        "figtree-semibold": ["Figtree_600SemiBold", "sans-serif"],
        "figtree-bold": ["Figtree_700Bold", "sans-serif"],
        "figtree-light": ["Figtree_300Light", "sans-serif"],
      },
    },
  },
  plugins: [],
};
