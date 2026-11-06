import { cycleStartDayBounds } from "@/core/utils/budget-cycle";
import { Text } from "@/shared/components/ui/text";
import { DatePickerField } from "@/shared/forms/DatePickerField";
import { FormFieldLabel } from "@/shared/forms/FormFieldLabel";
import { messages } from "@/shared/i18n";
import { useFormikContext } from "formik";
import { useMemo } from "react";
import { View } from "react-native";
import type { BudgetFormValues } from "../schemas";

export function CycleStartField() {
  const { values, setFieldValue } = useFormikContext<BudgetFormValues>();
  const bounds = useMemo(() => cycleStartDayBounds(), []);

  return (
    <View className="gap-2">
      <FormFieldLabel label={messages.Budget.cycle_start_label} />
      <DatePickerField
        value={values.cycleDay}
        onChange={(value) => void setFieldValue("cycleDay", value)}
        minDate={bounds.min}
        maxDate={bounds.max}
        placeholder={messages.Budget.cycle_start_label}
      />
      <Text className="text-xs text-muted-foreground">{messages.Budget.cycle_start_hint}</Text>
    </View>
  );
}
