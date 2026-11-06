import { useThemeColors } from "@/shared/hooks";
import { Link, type LinkProps } from "expo-router";

export const ThemedLink = ({ style, ...props }: LinkProps) => {
  const { primary } = useThemeColors();
  return (
    <Link
      {...props}
      style={[
        { color: primary, fontFamily: "Figtree_400Regular", fontSize: 15 },
        style,
      ]}
    />
  );
};
