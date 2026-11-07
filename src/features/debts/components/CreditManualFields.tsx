import type { CreditKind } from "@/core/types/domain";
import { Text } from "@/shared/components/ui/text";
import { FormCurrencyField } from "@/shared/forms/FormCurrencyField";
import { FormField } from "@/shared/forms/FormField";
import { messages } from "@/shared/i18n";
import { IconBuildingBank, IconListNumbers, IconCalendarTime } from "@tabler/icons-react-native";
import { View } from "react-native";
import { CREDIT_NAME_MAX } from "../interfaces";
import { DebtDateField, DebtIntegerField } from "./DebtFormInputs";

export function CreditManualFields({ kind }: { kind: CreditKind }) {
  const isLoan = kind === "CONSUMO";

  return (
    <View className="gap-4">
      <View className="gap-1">
        <Text className="font-figtree-semibold text-base">{messages.Debts.manual_mode_title}</Text>
        <Text className="text-xs text-muted-foreground">{messages.Debts.manual_mode_hint}</Text>
      </View>
      <FormField
        name="bankName"
        label={messages.Debts.bank_name_label}
        icon={IconBuildingBank}
        placeholder={messages.Debts.bank_name_placeholder}
        maxLength={CREDIT_NAME_MAX}
        autoCapitalize="words"
        returnKeyType="next"
      />
      <FormCurrencyField name="remainingBalance" label={messages.Debts.remaining_balance_label} />
      <DebtDateField
        name="dueDate"
        label={messages.Debts.due_date_label}
        placeholder={messages.Debts.due_date_placeholder}
      />
      {isLoan ? (
        <FormCurrencyField name="installment" label={messages.Debts.installment_label} />
      ) : (
        <>
          <FormCurrencyField name="minPayment" label={messages.Debts.min_payment_label} />
          <FormCurrencyField
            name="creditLimit"
            label={messages.Debts.credit_limit_optional_label}
            required={false}
          />
          <DebtDateField
            name="cutoffDate"
            label={messages.Debts.cutoff_date_optional_label}
            placeholder={messages.Debts.cutoff_date_placeholder}
            required={false}
          />
        </>
      )}
      <View className="flex-row gap-2">
        <View className="flex-1">
          <DebtIntegerField
            name="installmentCurrent"
            label={
              isLoan
                ? messages.Debts.installment_current_label
                : messages.Debts.installment_current_optional_label
            }
            icon={IconListNumbers}
            required={isLoan}
          />
        </View>
        <View className="flex-1">
          <DebtIntegerField
            name="termMonths"
            label={
              isLoan ? messages.Debts.term_months_label : messages.Debts.term_months_optional_label
            }
            icon={IconCalendarTime}
            required={isLoan}
          />
        </View>
      </View>
    </View>
  );
}
