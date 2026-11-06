import { playPressSound } from "@/shared/audio/ui-sound";
import { Switch } from "@/shared/components/ui/switch";
import { Text } from "@/shared/components/ui/text";
import { View } from "react-native";

type SwitchRowProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
};

export function SwitchRow({ label, checked, onCheckedChange, disabled = false }: SwitchRowProps) {
  return (
    <View className="min-h-11 flex-row items-center justify-between gap-3">
      <Text className={`min-w-0 flex-1 font-figtree-medium text-sm ${disabled ? "opacity-50" : ""}`}>{label}</Text>
      <Switch
        accessibilityLabel={label}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(next) => {
          playPressSound();
          onCheckedChange(next);
        }}
      />
    </View>
  );
}

export type { SwitchRowProps };
