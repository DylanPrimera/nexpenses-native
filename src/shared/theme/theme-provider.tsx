import { AppColors, type ThemePalette } from "@/shared/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
} from "react";

const THEME_STORAGE_KEY = "currentTheme";

export type ThemePreference = "light" | "dark" | "system";

interface ThemeContextValue {
  preference: ThemePreference;
  isReady: boolean;
  resolvedScheme: "light" | "dark";
  colors: ThemePalette;
  setThemePreference: (value: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useAppTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useAppTheme must be used within AppThemeProvider");
  }
  return ctx;
};

export const AppThemeProvider = ({ children }: PropsWithChildren) => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [isReady, setReady] = useState(false);
  const [preference, setPreference] = useState<ThemePreference>("system");

  const resolvedScheme: "light" | "dark" =
    preference === "system" ? (colorScheme === "dark" ? "dark" : "light") : preference;

  const colors: ThemePalette = AppColors[resolvedScheme];

  const persist = useCallback(async (value: ThemePreference) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, value);
    } catch {}
  }, []);

  const applyStoredPreference = useEffectEvent((value: ThemePreference) => {
    setPreference(value);
    setColorScheme(value);
  });

  useEffect(() => {
    let active = true;
    void AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((stored) => {
        if (!active) return;
        const value = stored === "light" || stored === "dark" ? stored : "system";
        applyStoredPreference(value);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const setThemePreference = useCallback(
    (next: ThemePreference) => {
      setPreference(next);
      setColorScheme(next);
      void persist(next);
    },
    [persist, setColorScheme],
  );

  const value = useMemo(
    () => ({
      preference,
      isReady,
      resolvedScheme,
      colors,
      setThemePreference,
    }),
    [preference, isReady, resolvedScheme, colors, setThemePreference],
  );

  return (
    <NavThemeProvider value={resolvedScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    </NavThemeProvider>
  );
};
