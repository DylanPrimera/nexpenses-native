/** Exact hex tokens from Next `app/globals.css` (JS usage: StatusBar, Splash, inline). */
export const AppColors = {
  light: {
    primary: "#0d9668",
    secondary: "#e8f0ec",
    tertiary: "#38bdf8",
    success: "#10b981",
    destructive: "#93000a",
    text: "#0f1416",
    foreground: "#0f1416",
    background: "#eef2f0",
    card: "#f4f7f5",
    popover: "#f8faf9",
    border: "#dce4e0",
    input: "#dce4e0",
    muted: "#5c6b63",
    mutedForeground: "#5c6b63",
    accent: "#ecf3ef",
    ring: "#0d9668",
    primaryForeground: "#ffffff",
    stitchPrimary: "#4eedb8",
    navPillBg: "#f4f7f5",
  },
  dark: {
    primary: "#4eedb8",
    secondary: "#262b2d",
    tertiary: "#38bdf8",
    success: "#10b981",
    destructive: "#ffb4ab",
    text: "#dfe3e6",
    foreground: "#dfe3e6",
    background: "#0f1416",
    card: "#1b2022",
    popover: "#171c1e",
    border: "#303638",
    input: "#303638",
    muted: "#bbcac1",
    mutedForeground: "#bbcac1",
    accent: "#303638",
    ring: "#4eedb8",
    primaryForeground: "#0a0f11",
    stitchPrimary: "#4eedb8",
    navPillBg: "rgba(27, 32, 34, 0.95)",
  },
} as const;

export type ThemeScheme = keyof typeof AppColors;
export type ThemeColor = keyof (typeof AppColors)["light"];
export type ThemePalette = { [K in ThemeColor]: string };
