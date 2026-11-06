import { useThemeColors } from "@/shared/hooks";
import { ActivityIndicator, View } from "react-native";

export const FullScreenLoader = () => {
  const { primary, background } = useThemeColors();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: background,
      }}
    >
      <ActivityIndicator color={primary} size={30} />
    </View>
  );
};
