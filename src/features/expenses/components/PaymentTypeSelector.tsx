import type { PaymentType } from "@/core/types/domain";
import { playPressSound } from "@/shared/audio/ui-sound";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { IconCards, IconCash, IconCreditCard, type Icon as TablerIconType } from "@tabler/icons-react-native";
import { Pressable, View } from "react-native";

const OPTIONS: { id: PaymentType; label: string; icon: TablerIconType }[] = [
  { id: "debit_card", label: messages.PaymentType.debit_card, icon: IconCreditCard },
  { id: "credit_card", label: messages.PaymentType.credit_card, icon: IconCards },
  { id: "cash", label: messages.PaymentType.cash, icon: IconCash },
];

type PaymentTypeSelectorProps = {
  value: PaymentType;
  onChange: (value: PaymentType) => void;
};

export function PaymentTypeSelector({ value, onChange }: PaymentTypeSelectorProps) {
  return (
    <View role="radiogroup" accessibilityLabel={messages.Expense.payment_label} className="flex-row gap-2">
      {OPTIONS.map((option) => {
        const selected = value === option.id;
        const tone = selected ? "text-primary" : "text-muted-foreground";
        return (
          <Pressable
            key={option.id}
            role="radio"
            accessibilityState={{ checked: selected }}
            onPress={() => {
              if (selected) return;
              playPressSound();
              onChange(option.id);
            }}
            className={`flex-1 items-center justify-center gap-1.5 rounded-md p-2.5 ${selected ? "bg-primary/15" : "bg-muted active:bg-accent"}`}
          >
            <Icon as={option.icon} size={24} strokeWidth={selected ? 2.2 : 1.75} className={tone} />
            <Text
              numberOfLines={1}
              className={`text-center text-[11px] leading-tight ${selected ? "font-figtree-semibold" : "font-figtree-medium"} ${tone}`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
