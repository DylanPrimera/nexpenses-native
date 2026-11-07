import { OptionList } from "@/shared/components/ui/OptionList";
import { playPressSound } from "@/shared/audio/ui-sound";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import {
  IconAdjustmentsHorizontal,
  IconCards,
  IconCash,
  IconCreditCard,
  type Icon as TablerIconType,
} from "@tabler/icons-react-native";
import { Pressable, View } from "react-native";
import type { PaymentFilter } from "../interfaces";

const OPTIONS: { id: PaymentFilter; label: string; icon: TablerIconType }[] = [
  { id: "all", label: messages.History.filter_all, icon: IconAdjustmentsHorizontal },
  { id: "debit_card", label: messages.PaymentType.chip_debit, icon: IconCreditCard },
  { id: "credit_card", label: messages.PaymentType.chip_credit, icon: IconCards },
  { id: "cash", label: messages.PaymentType.chip_cash, icon: IconCash },
];

type PaymentFilterChipsProps = {
  value: PaymentFilter;
  onChange: (value: PaymentFilter) => void;
};

export function PaymentFilterChips({ value, onChange }: PaymentFilterChipsProps) {
  return (
    <View
      role="radiogroup"
      accessibilityLabel={messages.History.payment_section}
      className="flex-row gap-2"
    >
      <OptionList
        items={OPTIONS}
        getKey={(item) => item.id}
        extraData={value}
        minHeight={60}
        renderOption={(option) => {
          const selected = value === option.id;
          const tone = selected ? "text-foreground" : "text-muted-foreground";
          return (
            <Pressable
              key={option.id}
              role="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ checked: selected }}
              onPress={() => {
                if (selected) return;
                playPressSound();
                onChange(option.id);
              }}
              className={`min-h-12 w-full shrink-0 items-center justify-center gap-1 rounded-md px-1 py-2.5 ${selected ? "bg-primary/15" : "bg-muted active:bg-accent"}`}
            >
              <Icon
                as={option.icon}
                size={20}
                strokeWidth={selected ? 2.2 : 1.75}
                className={tone}
              />
              <Text
                className={`text-center text-[11px] leading-tight ${selected ? "font-figtree-semibold" : "font-figtree-medium"} ${tone}`}
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
