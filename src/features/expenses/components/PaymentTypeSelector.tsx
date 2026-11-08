import { ChoiceCard } from "@/shared/components/ui/ChoiceCard";
import { OptionList } from "@/shared/components/ui/OptionList";
import type { PaymentType } from "@/core/types/domain";
import { messages } from "@/shared/i18n";
import {
  IconCards,
  IconCash,
  IconCreditCard,
  type Icon as TablerIconType,
} from "@tabler/icons-react-native";
import { View } from "react-native";

const OPTIONS: { id: PaymentType; label: string; icon: TablerIconType }[] = [
  { id: "debit_card", label: messages.PaymentType.debit_card, icon: IconCreditCard },
  { id: "credit_card", label: messages.PaymentType.credit_card, icon: IconCards },
  { id: "cash", label: messages.PaymentType.cash, icon: IconCash },
];

type PaymentTypeSelectorProps = {
  value: PaymentType;
  onChange: (value: PaymentType) => void;
  disabledTypes?: readonly PaymentType[];
};

export function PaymentTypeSelector({
  value,
  onChange,
  disabledTypes = [],
}: PaymentTypeSelectorProps) {
  return (
    <View
      role="radiogroup"
      accessibilityLabel={messages.Expense.payment_label}
      className="flex-row gap-2"
    >
      <OptionList
        items={OPTIONS}
        getKey={(item) => item.id}
        extraData={[value, disabledTypes]}
        minHeight={48}
        renderOption={(option) => (
          <ChoiceCard
            label={option.label}
            icon={option.icon}
            selected={value === option.id}
            disabled={disabledTypes.includes(option.id)}
            onSelect={() => onChange(option.id)}
          />
        )}
      />
    </View>
  );
}
