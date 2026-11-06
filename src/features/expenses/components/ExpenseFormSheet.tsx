import { useCycleSummary } from "@/features/budget/hooks";
import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { zodFormikValidate } from "@/shared/forms/zod-formik";
import { messages } from "@/shared/i18n";
import { AppSheet } from "@/shared/overlays/AppSheet";
import { notifyError, notifySuccess, notifyWarning } from "@/shared/toast/notify";
import { IconCashBanknote, IconCheck, IconPencil, IconPlus } from "@tabler/icons-react-native";
import { FormikProvider, useFormik, useFormikContext } from "formik";
import { View } from "react-native";
import { useCreateExpense, useUpdateExpense } from "../hooks";
import type { Expense } from "../interfaces";
import {
  availableForExpense,
  expenseFormValues,
  expenseInput,
  expenseSaveFeedback,
} from "../lib/expense-display";
import { expenseSchema, type ExpenseFormValues } from "../schemas";
import { ExpenseFormFields } from "./ExpenseFormFields";

type ExpenseFormSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense | null;
};

function ExpenseFormActions({ editing, onCancel }: { editing: boolean; onCancel: () => void }) {
  const { values, isSubmitting, submitForm } = useFormikContext<ExpenseFormValues>();
  const disabled = isSubmitting || !expenseSchema.safeParse(values).success;

  return (
    <View className="flex-row gap-2">
      <Button variant="secondary" size="lg" className="flex-1" onPress={onCancel}>
        <Text className="font-figtree-semibold">{messages.Common.cancel}</Text>
      </Button>
      <Button size="lg" className="flex-1" disabled={disabled} onPress={() => void submitForm()}>
        <Icon as={editing ? IconCheck : IconPlus} size={20} strokeWidth={2.5} className="text-primary-foreground" />
        <Text className="font-figtree-bold">{editing ? messages.Expense.edit_button : messages.Expense.save_button}</Text>
      </Button>
    </View>
  );
}

function ExpenseFormHeader({ editing }: { editing: boolean }) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="size-11 items-center justify-center rounded-[0.875rem] bg-primary/15">
        <Icon as={editing ? IconPencil : IconCashBanknote} size={22} strokeWidth={1.75} className="text-primary" />
      </View>
      <View className="min-w-0 flex-1">
        <Text role="heading" className="font-figtree-semibold text-lg leading-tight tracking-tight">
          {editing ? messages.Expense.edit_title : messages.Expense.add_title}
        </Text>
        <Text className="mt-0.5 text-sm text-muted-foreground">
          {editing ? messages.Expense.edit_subtitle : messages.Expense.add_subtitle}
        </Text>
      </View>
    </View>
  );
}

export function ExpenseFormSheet({ isOpen, onClose, expense }: ExpenseFormSheetProps) {
  const editing = !!expense;
  const { data: summary } = useCycleSummary();
  const { mutateAsync: createExpense } = useCreateExpense();
  const { mutateAsync: updateExpense } = useUpdateExpense();
  const available = availableForExpense(summary?.remaining ?? 0, expense);
  const formik = useFormik<ExpenseFormValues>({
    initialValues: expenseFormValues(expense),
    enableReinitialize: true,
    validate: zodFormikValidate(expenseSchema),
    onSubmit: async (values) => {
      const input = expenseInput(values);
      try {
        if (expense) await updateExpense({ id: expense.id, input });
        else await createExpense(input);
      } catch {
        notifyError();
        return;
      }
      const feedback = expenseSaveFeedback({ amount: input.amount, available, editing });
      if (feedback.tone === "warning") notifyWarning(feedback.message);
      else notifySuccess(feedback.message);
      handleClose();
    },
  });

  function handleClose() {
    formik.resetForm();
    onClose();
  }

  return (
    <AppSheet
      isOpen={isOpen}
      onChange={(open) => {
        if (!open) handleClose();
      }}
      header={<ExpenseFormHeader editing={editing} />}
      footer={
        <FormikProvider value={formik}>
          <ExpenseFormActions editing={editing} onCancel={handleClose} />
        </FormikProvider>
      }
    >
      <FormikProvider value={formik}>
        <ExpenseFormFields available={available} />
      </FormikProvider>
    </AppSheet>
  );
}

export function AddExpenseSheet({ isOpen, onChange }: { isOpen: boolean; onChange: (open: boolean) => void }) {
  return <ExpenseFormSheet isOpen={isOpen} onClose={() => onChange(false)} />;
}
