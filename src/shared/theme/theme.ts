import { AppColors } from "@/shared/theme/colors";

/** Mirrored tokens for React Navigation / inline styles (RNR-style). */
export const THEME = {
  light: AppColors.light,
  dark: AppColors.dark,
} as const;

export const NAV_THEME = {
  light: {
    dark: false as const,
    colors: {
      primary: AppColors.light.primary,
      background: AppColors.light.background,
      card: AppColors.light.card,
      text: AppColors.light.foreground,
      border: AppColors.light.border,
      notification: AppColors.light.destructive,
    },
  },
  dark: {
    dark: true as const,
    colors: {
      primary: AppColors.dark.primary,
      background: AppColors.dark.background,
      card: AppColors.dark.card,
      text: AppColors.dark.foreground,
      border: AppColors.dark.border,
      notification: AppColors.dark.destructive,
    },
  },
};
