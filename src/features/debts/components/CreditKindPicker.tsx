import { OptionList } from "@/shared/components/ui/OptionList";
import type { CreditKind } from "@/core/types/domain";
import { playPressSound } from "@/shared/audio/ui-sound";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { IconCash, IconCreditCard, type Icon as TablerIconType } from "@tabler/icons-react-native";
import { Pressable, View } from "react-native";

const OPTIONS: { id: CreditKind; label: string; icon: TablerIconType }[] = [
  { id: "TC", label: messages.Debts.kind_tc, icon: IconCreditCard },
  { id: "CONSUMO", label: messages.Debts.kind_consumo, icon: IconCash },
];

type CreditKindPickerProps = {
  value: CreditKind;
  onChange: (value: CreditKind) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

export function CreditKindPicker({
  value,
  onChange,
  disabled = false,
  accessibilityLabel = messages.Debts.configure_title,
}: CreditKindPickerProps) {
  return (
    <View role="radiogroup" accessibilityLabel={accessibilityLabel} className="flex-row gap-2">
      <OptionList
        items={OPTIONS}
        getKey={(item) => item.id}
        extraData={[value, disabled]}
        minHeight={88}
        renderOption={(option) => {
          const selected = value === option.id;
          const tone = selected ? "text-foreground" : "text-muted-foreground";
          return (
            <Pressable
              key={option.id}
              role="radio"
              disabled={disabled}
              accessibilityState={{ checked: selected, disabled }}
              onPress={() => {
                if (selected) return;
                playPressSound();
                onChange(option.id);
              }}
              className={`w-full shrink-0 items-center justify-center gap-1.5 rounded-md p-3 ${selected ? "bg-primary/15" : "bg-muted active:bg-accent"} ${disabled ? "opacity-50" : ""}`}
            >
              <Icon
                as={option.icon}
                size={24}
                strokeWidth={selected ? 2.2 : 1.75}
                className={tone}
              />
              <Text
                className={`text-center text-xs leading-tight ${selected ? "font-figtree-semibold" : "font-figtree-medium"} ${tone}`}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
