import { ChoiceCard } from "@/shared/components/ui/ChoiceCard";
import { OptionList } from "@/shared/components/ui/OptionList";
import type { CreditKind } from "@/core/types/domain";
import { messages } from "@/shared/i18n";
import { IconCash, IconCreditCard, type Icon as TablerIconType } from "@tabler/icons-react-native";
import { View } from "react-native";

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
        minHeight={48}
        renderOption={(option) => (
          <ChoiceCard
            label={option.label}
            icon={option.icon}
            selected={value === option.id}
            disabled={disabled}
            onSelect={() => onChange(option.id)}
          />
        )}
      />
    </View>
  );
}
