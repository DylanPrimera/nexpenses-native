import { formatCOPCurrency } from "@/core/utils/currency";
import { useRecurring, type RecurringExpense } from "@/features/recurring";
import { Field, FieldError } from "@/shared/components/ui/Field";
import { Icon } from "@/shared/components/ui/Icon";
import { SwitchRow } from "@/shared/components/ui/SwitchRow";
import { Text } from "@/shared/components/ui/text";
import { visibleFieldError } from "@/shared/forms/field-meta";
import { FormFieldLabel } from "@/shared/forms/FormFieldLabel";
import { SearchListField } from "@/shared/forms/SearchListField";
import { messages } from "@/shared/i18n";
import { IconRepeat } from "@tabler/icons-react-native";
import { useField, useFormikContext } from "formik";
import { View } from "react-native";
import type { ExpenseFormValues } from "../schemas";

const sortByTitle = (items: RecurringExpense[]) => items.sort((a, b) => a.title.localeCompare(b.title, "es"));

function templateHaystack(template: RecurringExpense) {
  return [template.title, template.description, template.category?.name].filter(Boolean).join(" ").toLowerCase();
}

function TemplateSummary({ template }: { template: RecurringExpense }) {
  return (
    <View className="min-w-0 flex-row items-center gap-2.5">
      <Icon as={IconRepeat} size={18} className="text-muted-foreground" />
      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} className="text-sm">
          {template.title}
        </Text>
        <Text numberOfLines={1} className="text-xs text-muted-foreground">
          {[formatCOPCurrency(template.amount), template.category?.name].filter(Boolean).join(" · ")}
        </Text>
      </View>
    </View>
  );
}

function TemplatePicker() {
  const [field, meta] = useField<string>("recurringId");
  const { setValues, setFieldTouched, submitCount } = useFormikContext<ExpenseFormValues>();
  const { data: templates = [], isPending, isError } = useRecurring();
  const error = visibleFieldError(meta, { submitted: submitCount > 0 });

  const select = (id: string) => {
    const template = templates.find((item) => item.id === id);
    void setValues((current) => ({
      ...current,
      recurringId: id,
      ...(template && {
        amount: template.amount,
        categoryId: template.categoryId,
        paymentType: template.paymentType,
        title: template.title,
        description: template.description,
      }),
    }));
    void setFieldTouched("recurringId", true, false);
  };

  if (isPending) return <Text className="text-xs text-muted-foreground">{messages.Expense.recurring_loading}</Text>;
  if (isError && templates.length === 0) {
    return <Text className="text-xs text-muted-foreground">{messages.Expense.recurring_load_error}</Text>;
  }
  if (templates.length === 0) {
    return <Text className="text-xs text-muted-foreground">{messages.Expense.recurring_empty}</Text>;
  }

  return (
    <Field invalid={!!error} className="gap-2">
      <FormFieldLabel label={messages.Expense.recurring_select_label} />
      <SearchListField
        value={field.value}
        onChange={select}
        items={templates}
        getItemId={(item) => item.id}
        filterItem={(item, query) => templateHaystack(item).includes(query)}
        sortItems={sortByTitle}
        renderSelected={(item) => <TemplateSummary template={item} />}
        renderOption={(item) => <TemplateSummary template={item} />}
        placeholder={messages.Expense.recurring_select_placeholder}
        emptyListText={messages.Expense.recurring_empty}
        noResultsText={messages.Expense.recurring_no_results}
        clearLabel={messages.Expense.clear_recurring}
        hasError={!!error}
      />
      <FieldError errors={error} />
    </Field>
  );
}

export function RecurringUseSection() {
  const { values, setValues } = useFormikContext<ExpenseFormValues>();
  const enabled = values.source === "recurring";

  return (
    <View className="gap-3">
      <SwitchRow
        label={messages.Expense.recurring_use_switch}
        checked={enabled}
        disabled={values.source === "credit"}
        onCheckedChange={(checked) =>
          void setValues((current) => ({
            ...current,
            source: checked ? "recurring" : "manual",
            recurringId: "",
            saveAsRecurring: checked ? false : current.saveAsRecurring,
          }))
        }
      />
      {enabled ? <TemplatePicker /> : null}
    </View>
  );
}
