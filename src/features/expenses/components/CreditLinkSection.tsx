import { useConnectivity } from "@/core/network/connectivity";
import type { CreditKind, Credit } from "@/core/types/domain";
import { creditInstallmentAmount, CreditKindPicker, useCredits } from "@/features/debts";
import { Field, FieldError } from "@/shared/components/ui/Field";
import { Icon } from "@/shared/components/ui/Icon";
import { SwitchRow } from "@/shared/components/ui/SwitchRow";
import { Text } from "@/shared/components/ui/text";
import { visibleFieldError } from "@/shared/forms/field-meta";
import { FormFieldLabel } from "@/shared/forms/FormFieldLabel";
import { SearchListField } from "@/shared/forms/SearchListField";
import { formatCOPCurrency } from "@/core/utils/currency";
import { messages } from "@/shared/i18n";
import { IconBuildingBank, IconCreditCard } from "@tabler/icons-react-native";
import { useField, useFormikContext } from "formik";
import { useEffect } from "react";
import { View } from "react-native";
import type { ExpenseFormValues } from "../schemas";

const sortByName = (items: Credit[]) =>
  items.sort((a, b) => a.displayName.localeCompare(b.displayName, "es"));

function creditHaystack(credit: Credit) {
  return [credit.displayName, credit.bank].filter(Boolean).join(" ").toLowerCase();
}

function CreditSummary({ credit, showAmount }: { credit: Credit; showAmount: boolean }) {
  const hint = creditInstallmentAmount(credit);
  const detail = [credit.bank, showAmount && hint > 0 ? formatCOPCurrency(hint) : null]
    .filter(Boolean)
    .join(" · ");
  return (
    <View className="min-w-0 flex-row items-center gap-2.5">
      <Icon
        as={credit.kind === "CONSUMO" ? IconBuildingBank : IconCreditCard}
        size={18}
        className="text-muted-foreground"
      />
      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} className="text-sm capitalize">
          {credit.displayName}
        </Text>
        {detail ? (
          <Text numberOfLines={1} className="text-xs text-muted-foreground">
            {detail}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function CreditPicker() {
  const [field, meta] = useField<string>("creditId");
  const { values, setValues, setFieldValue, setFieldTouched, submitCount } =
    useFormikContext<ExpenseFormValues>();
  const { data: credits = [], isPending, isError } = useCredits();
  const error = visibleFieldError(meta, { submitted: submitCount > 0 });
  const kind = values.creditKind;
  const visible = credits.filter((credit) => credit.kind === kind);
  const linkedCredit = credits.find((credit) => credit.id === field.value);

  useEffect(() => {
    if (linkedCredit && linkedCredit.kind !== kind)
      void setFieldValue("creditKind", linkedCredit.kind);
  }, [linkedCredit, kind, setFieldValue]);

  const changeKind = (next: CreditKind) => {
    void setValues((current) => ({
      ...current,
      creditKind: next,
      creditId: credits.some((credit) => credit.id === current.creditId && credit.kind === next)
        ? current.creditId
        : "",
    }));
  };

  const select = (id: string) => {
    const credit = credits.find((item) => item.id === id);
    const hint = credit ? creditInstallmentAmount(credit) : 0;
    void setValues((current) => ({
      ...current,
      creditId: id,
      ...(hint > 0 && { amount: hint }),
    }));
    void setFieldTouched("creditId", true, false);
  };

  const listing = () => {
    if (isPending)
      return (
        <Text className="text-xs text-muted-foreground">{messages.Expense.credit_loading}</Text>
      );
    if (isError && credits.length === 0) {
      return <Text className="text-xs text-muted-foreground">{messages.Debts.load_error}</Text>;
    }
    if (visible.length === 0) {
      return (
        <Text className="text-xs text-muted-foreground">
          {kind === "TC" ? messages.Expense.credit_empty_tc : messages.Expense.credit_empty_consumo}
        </Text>
      );
    }
    return (
      <SearchListField
        value={field.value}
        onChange={select}
        items={visible}
        getItemId={(item) => item.id}
        filterItem={(item, query) => creditHaystack(item).includes(query)}
        sortItems={sortByName}
        renderSelected={(item) => <CreditSummary credit={item} showAmount={false} />}
        renderOption={(item) => <CreditSummary credit={item} showAmount />}
        placeholder={messages.Expense.credit_select_placeholder}
        emptyListText={messages.Expense.credit_select_placeholder}
        noResultsText={messages.Expense.credit_no_results}
        clearLabel={messages.Expense.clear_credit}
        hasError={!!error}
      />
    );
  };

  return (
    <View className="gap-3">
      <View className="gap-2">
        <FormFieldLabel label={messages.Expense.credit_kind_label} required={false} />
        <CreditKindPicker
          value={kind}
          onChange={changeKind}
          accessibilityLabel={messages.Expense.credit_kind_label}
        />
      </View>
      <Field invalid={!!error} className="gap-2">
        <FormFieldLabel label={messages.Expense.credit_select_label} />
        {listing()}
        <FieldError errors={error} />
      </Field>
    </View>
  );
}

export function CreditLinkSection({ editing }: { editing: boolean }) {
  const { isOnline } = useConnectivity();
  const { values, setValues } = useFormikContext<ExpenseFormValues>();
  const linked = values.source === "credit";
  const switchDisabled = !editing && (values.source === "recurring" || values.source === "notice");

  return (
    <View className="gap-3">
      <SwitchRow
        label={messages.Expense.credit_switch}
        checked={linked}
        disabled={switchDisabled || !isOnline}
        onCheckedChange={(checked) =>
          void setValues((current) => ({
            ...current,
            source: checked ? "credit" : "manual",
            creditId: "",
            saveAsRecurring: checked ? false : current.saveAsRecurring,
            paymentType:
              checked && current.paymentType === "credit_card" ? "debit_card" : current.paymentType,
          }))
        }
      />
      {!isOnline ? (
        <Text className="text-xs text-muted-foreground">{messages.Offline.advanced_online}</Text>
      ) : null}
      {linked ? <CreditPicker /> : null}
    </View>
  );
}
