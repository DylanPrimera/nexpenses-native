import { useThemeColors } from "@/shared/hooks";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { ActivityIndicator, Pressable, type PressableProps, StyleSheet, Text } from "react-native";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface ThemedButtonProps extends PressableProps {
  children: React.ReactNode;
  icon?: IconName;
  iconColor?: string;
  loading?: boolean;
}

export const ThemedButton = ({
  children,
  icon,
  iconColor = "white",
  loading = false,
  disabled,
  ...props
}: ThemedButtonProps) => {
  const { primary } = useThemeColors();
  const isDisabled = disabled || loading;
  // NativeWind's Pressable interop drops function styles, so track pressed state manually.
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      {...props}
      onPressIn={(event) => {
        setPressed(true);
        props.onPressIn?.(event);
      }}
      onPressOut={(event) => {
        setPressed(false);
        props.onPressOut?.(event);
      }}
      style={[
        styles.button,
        {
          backgroundColor: primary,
          opacity: isDisabled ? 0.6 : pressed ? 0.9 : 1,
          gap: icon ? 10 : 0,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <>
          {typeof children === "string" ? (
            <Text className="font-figtree-semibold text-base text-white">{children}</Text>
          ) : (
            children
          )}
          {icon ? <Ionicons name={icon} size={18} color={iconColor} /> : null}
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
