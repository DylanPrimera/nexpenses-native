import { useThemeColors } from "@/shared/hooks";
import { View, type ViewProps } from "react-native";

interface ThemedViewProps extends ViewProps {
  className?: string;
}

export const ThemedView = ({ style, className, ...props }: ThemedViewProps) => {
  const { background } = useThemeColors();
  return (
    <View className={className} style={[{ backgroundColor: background }, style]} {...props} />
  );
};
