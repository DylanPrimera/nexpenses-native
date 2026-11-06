export const AppColors = {
  light: {
    primary: "#49129c",
    secondary: "#b40086",
    tertiary: "#ef2967",
    success: "#52d49b",
    text: "#000000",
    background: "#f5f5f5",
    card: "#ffffff",
    border: "#e5e5e5",
    muted: "#6b7280",
  },
  dark: {
    primary: "#7a4edc",
    secondary: "#d138a8",
    tertiary: "#ff527f",
    success: "#3a9d78",
    text: "#ecedee",
    background: "#17202a",
    card: "#1f2a36",
    border: "#2e3a47",
    muted: "#9ca3af",
  },
} as const;

export type ThemeScheme = keyof typeof AppColors;
export type ThemeColor = keyof (typeof AppColors)["light"];
export type ThemePalette = { [K in ThemeColor]: string };
