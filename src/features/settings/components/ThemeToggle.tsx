import { OptionList } from "@/shared/components/ui/OptionList";
import { useAppTheme, type ThemePreference } from "@/shared/theme";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import {
  IconDeviceDesktop,
  IconMoon,
  IconSun,
  type Icon as TablerIconType,
} from "@tabler/icons-react-native";
import { Pressable, View } from "react-native";

type ThemeOption = {
  value: ThemePreference;
  label: string;
  icon: TablerIconType;
};

const THEME_OPTIONS: readonly ThemeOption[] = [
  { value: "light", label: messages.Settings.theme_light, icon: IconSun },
  { value: "dark", label: messages.Settings.theme_dark, icon: IconMoon },
  { value: "system", label: messages.Settings.theme_system, icon: IconDeviceDesktop },
];

export function ThemeToggle() {
  const { preference, setThemePreference } = useAppTheme();

  return (
    <View role="radiogroup" className="flex-row gap-2 rounded-[0.875rem] bg-background p-1.5">
      <OptionList
        items={THEME_OPTIONS}
        getKey={(item) => item.value}
        extraData={preference}
        minHeight={48}
        renderOption={({ value, label, icon }) => {
          const selected = preference === value;
          const optionClass = selected
            ? "border-border bg-card shadow-sm shadow-black/5"
            : "border-transparent active:opacity-70";

          return (
            <Pressable
              key={value}
              role="radio"
              accessibilityLabel={label}
              accessibilityState={{ selected }}
              onPress={() => setThemePreference(value)}
              className={`min-h-12 w-full shrink-0 flex-row items-center justify-center gap-1.5 rounded-[0.625rem] border px-2 py-2.5 active:scale-95 ${optionClass}`}
            >
              <Icon
                as={icon}
                size={18}
                strokeWidth={selected ? 2.2 : 1.75}
                className={selected ? "text-primary" : "text-muted-foreground"}
              />
              <Text
                className={`font-figtree-semibold text-sm ${selected ? "text-primary" : "text-muted-foreground"}`}
              >
                {label}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
