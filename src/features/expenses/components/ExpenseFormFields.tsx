import { FormCurrencyField } from "@/shared/forms/FormCurrencyField";
import { FormField } from "@/shared/forms/FormField";
import { Text } from "@/shared/components/ui/text";
import { FormFieldLabel } from "@/shared/forms/FormFieldLabel";
import { messages } from "@/shared/i18n";
import { IconAlignLeft, IconTag } from "@tabler/icons-react-native";
import { useFormikContext } from "formik";
import { View } from "react-native";
import { EXPENSE_DESCRIPTION_MAX, EXPENSE_TITLE_MAX, type ExpenseFormValues } from "../schemas";
import { CategoryField } from "./CategoryField";
import { CreditLinkSection } from "./CreditLinkSection";
import { OverBudgetWarning } from "./OverBudgetWarning";
import { PasteNoticeSection } from "./PasteNoticeSection";
import { PaymentTypeSelector } from "./PaymentTypeSelector";
import { RecurringSaveSwitch } from "./RecurringSaveSwitch";
import { RecurringUseSection } from "./RecurringUseSection";

export function ExpenseFormFields({ available, editing }: { available: number; editing: boolean }) {
  const { values, setFieldValue } = useFormikContext<ExpenseFormValues>();
  const linked = values.source === "credit";

  return (
    <View className="gap-4">
      {editing ? null : <PasteNoticeSection />}
      {editing ? null : <RecurringUseSection />}
      <CreditLinkSection editing={editing} />
      <FormCurrencyField
        name="amount"
        label={messages.Expense.amount_label}
        placeholder={messages.Expense.amount_placeholder}
      />
      <CategoryField name="categoryId" />
      <View className="gap-2">
        <FormFieldLabel label={messages.Expense.payment_label} required={false} />
        <PaymentTypeSelector
          value={values.paymentType}
          onChange={(value) => void setFieldValue("paymentType", value)}
          disabledTypes={linked ? ["credit_card"] : []}
        />
        {linked ? <Text className="text-xs text-muted-foreground">{messages.Expense.credit_card_blocked}</Text> : null}
      </View>
      <FormField
        name="title"
        label={messages.Expense.title_label}
        placeholder={messages.Expense.title_placeholder}
        icon={IconTag}
        maxLength={EXPENSE_TITLE_MAX}
        autoCapitalize="sentences"
        returnKeyType="next"
      />
      <FormField
        name="description"
        label={messages.Expense.description_label}
        placeholder={messages.Expense.description_placeholder}
        icon={IconAlignLeft}
        maxLength={EXPENSE_DESCRIPTION_MAX}
        autoCapitalize="sentences"
        returnKeyType="done"
      />
      <OverBudgetWarning amount={values.amount} available={available} />
      {editing || linked ? null : <RecurringSaveSwitch />}
    </View>
  );
}
