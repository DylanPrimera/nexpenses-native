import { useThemeColors } from "@/shared/hooks";
import { Text, type TextProps } from "react-native";

type Variant = "body" | "title" | "subtitle" | "caption" | "link";

interface ThemedTextProps extends TextProps {
  className?: string;
  variant?: Variant;
  muted?: boolean;
}

const variantClass: Record<Variant, string> = {
  body: "font-figtree-regular text-base",
  title: "font-figtree-bold text-3xl",
  subtitle: "font-figtree-semibold text-lg",
  caption: "font-figtree-regular text-sm",
  link: "font-figtree-medium text-base",
};

export const ThemedText = ({
  className,
  variant = "body",
  muted = false,
  style,
  ...props
}: ThemedTextProps) => {
  const { text, muted: mutedColor, primary } = useThemeColors();
  const color = variant === "link" ? primary : muted ? mutedColor : text;

  return (
    <Text
      className={`${variantClass[variant]} ${className ?? ""}`}
      style={[{ color }, style]}
      {...props}
    />
  );
};
