import { messages } from "@/shared/i18n";
import { ConfirmDialog } from "@/shared/overlays/ConfirmDialog";
import { notifyError, notifySuccess } from "@/shared/toast/notify";
import { useState } from "react";
import { useDeleteExpense } from "../hooks";
import type { Expense } from "../interfaces";
import { expenseAmountLabel, expenseDisplay } from "../lib/expense-display";
import { ExpenseDetailSheet } from "./ExpenseDetailSheet";
import { ExpenseFormSheet } from "./ExpenseFormSheet";

type ExpenseAction = "detail" | "edit" | "delete";

export type ExpenseOpeners = {
  onOpen: (expense: Expense) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
};

export function ExpenseActions({ children }: { children: (openers: ExpenseOpeners) => React.ReactNode }) {
  const [selected, setSelected] = useState<Expense | null>(null);
  const [action, setAction] = useState<ExpenseAction | null>(null);
  const { mutateAsync: deleteExpense } = useDeleteExpense();

  const open = (next: ExpenseAction) => (expense: Expense) => {
    setSelected(expense);
    setAction(next);
  };
  const close = () => setAction(null);

  const confirmDelete = async () => {
    if (!selected) return;
    try {
      await deleteExpense({ id: selected.id, creditId: selected.creditId });
      notifySuccess(messages.Expense.delete_success_message);
    } catch {
      notifyError();
    }
  };

  return (
    <>
      {children({ onOpen: open("detail"), onEdit: open("edit"), onDelete: open("delete") })}
      <ExpenseDetailSheet expense={selected} isOpen={action === "detail"} onClose={close} />
      <ExpenseFormSheet expense={selected} isOpen={action === "edit"} onClose={close} />
      <ConfirmDialog
        isOpen={action === "delete"}
        title={messages.Expense.delete_confirm_title}
        description={messages.Expense.delete_confirm_description}
        confirmLabel={messages.Expense.delete_confirm_button}
        isDestructive
        preview={selected ? { title: expenseDisplay(selected).title, amount: expenseAmountLabel(selected.amount) } : undefined}
        onConfirm={() => void confirmDelete()}
        onClose={close}
      />
    </>
  );
}
