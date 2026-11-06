import { useAppTheme } from "@/shared/theme";

export const useThemeColors = () => {
  const { colors, resolvedScheme } = useAppTheme();
  return { ...colors, scheme: resolvedScheme };
};
