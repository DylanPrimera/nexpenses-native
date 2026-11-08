import { playPressSound } from "@/shared/audio/ui-sound";
import { Icon } from "./Icon";
import { Text } from "./text";
import type { Icon as TablerIconType } from "@tabler/icons-react-native";
import { Pressable } from "react-native";

type Props = {
  label: string;
  icon: TablerIconType;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
};

export function ChoiceCard({ label, icon, selected, disabled = false, onSelect }: Props) {
  const tone = selected ? "text-primary" : "text-muted-foreground";
  return (
    <Pressable
      role="radio"
      disabled={disabled}
      accessibilityState={{ checked: selected, disabled }}
      onPress={() => {
        if (selected) return;
        playPressSound();
        onSelect();
      }}
      className={`w-full shrink-0 items-center justify-center gap-1.5 rounded-md p-2.5 ${selected ? "bg-primary/15" : "bg-muted active:bg-accent"} ${disabled ? "opacity-40" : ""}`}
    >
      <Icon as={icon} size={24} strokeWidth={selected ? 2.2 : 1.75} className={tone} />
      <Text
        className={`text-center text-[11px] leading-tight ${selected ? "font-figtree-semibold" : "font-figtree-medium"} ${tone}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
