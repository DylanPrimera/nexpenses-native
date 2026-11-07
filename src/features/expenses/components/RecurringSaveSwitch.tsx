import { useConnectivity } from "@/core/network/connectivity";
import { SwitchRow } from "@/shared/components/ui/SwitchRow";
import { messages } from "@/shared/i18n";
import { useFormikContext } from "formik";
import type { ExpenseFormValues } from "../schemas";

export function RecurringSaveSwitch() {
  const { isOnline } = useConnectivity();
  const { values, setFieldValue } = useFormikContext<ExpenseFormValues>();

  return (
    <SwitchRow
      label={messages.Expense.recurring_save_switch}
      checked={values.saveAsRecurring}
      disabled={
        !isOnline ||
        values.source === "recurring" ||
        (values.source === "notice" && values.amount <= 0)
      }
      onCheckedChange={(checked) => void setFieldValue("saveAsRecurring", checked)}
    />
  );
}
