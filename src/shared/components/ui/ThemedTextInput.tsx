import { useThemeColors } from "@/shared/hooks";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ComponentRef, useRef, useState } from "react";
import { TextInput, type TextInputProps, View } from "react-native";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface ThemedTextInputProps extends TextInputProps {
  icon?: IconName;
  className?: string;
}

export const ThemedTextInput = ({
  icon,
  style,
  className,
  ...props
}: ThemedTextInputProps) => {
  const { primary, text, card, border, muted, scheme } = useThemeColors();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const iconColor = isFocused ? primary : scheme === "dark" ? "#ffffff" : "#000000";

  return (
    <View
      className={`mb-2.5 flex-row items-center rounded-md border px-2 py-1 ${className ?? ""}`}
      style={{
        borderColor: isFocused ? primary : border,
        backgroundColor: card,
      }}
      onTouchStart={() => inputRef.current?.focus()}
    >
      {icon ? (
        <Ionicons name={icon} size={20} color={iconColor} style={{ marginRight: 10, marginLeft: 5 }} />
      ) : null}
      <TextInput
        ref={inputRef}
        placeholderTextColor={isFocused ? primary : muted}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="font-figtree-regular mr-2.5 flex-1 text-base"
        style={[{ color: text }, style]}
        {...props}
      />
    </View>
  );
};
