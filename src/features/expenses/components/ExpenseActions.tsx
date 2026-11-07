import type { AccessibilityFocusRef } from "@/shared/overlays/accessibility-focus";
import { useConnectivity } from "@/core/network/connectivity";
import { usePendingExpenses } from "../hooks/usePendingExpenses";
import { messages } from "@/shared/i18n";
import { ConfirmDialog } from "@/shared/overlays/ConfirmDialog";
import { notifyError, notifySuccess, notifyWarning } from "@/shared/toast/notify";
import { useState } from "react";
import { useDeleteExpense } from "../hooks";
import type { Expense } from "../interfaces";
import { expenseAmountLabel, expenseDisplay } from "../lib/expense-display";
import { ExpenseDetailSheet } from "./ExpenseDetailSheet";
import { ExpenseFormSheet } from "./ExpenseFormSheet";

type ExpenseAction = "detail" | "edit" | "delete";

export type ExpenseOpeners = {
  onOpen: (expense: Expense, returnTarget?: AccessibilityFocusRef) => void;
  onEdit: (expense: Expense, returnTarget?: AccessibilityFocusRef) => void;
  onDelete: (expense: Expense, returnTarget?: AccessibilityFocusRef) => void;
};

export function ExpenseActions({
  children,
}: {
  children: (openers: ExpenseOpeners) => React.ReactNode;
}) {
  const { isOnline } = useConnectivity();
  const pending = usePendingExpenses();
  const blocked = (expense: Expense) => {
    const message = pending.some((item) => item.expense.id === expense.id)
      ? messages.Offline.pending_action
      : !isOnline
        ? messages.Offline.action_requires_connection
        : null;
    if (message) notifyWarning(message);
    return !!message;
  };
  const [returnFocusRef, setReturnFocusRef] = useState<AccessibilityFocusRef | undefined>(
    undefined,
  );
  const [selected, setSelected] = useState<Expense | null>(null);
  const [action, setAction] = useState<ExpenseAction | null>(null);
  const { mutateAsync: deleteExpense } = useDeleteExpense();

  const open = (next: ExpenseAction) => (expense: Expense, target?: AccessibilityFocusRef) => {
    if (next !== "detail" && blocked(expense)) return;
    setReturnFocusRef(target);
    setSelected(expense);
    setAction(next);
  };
  const close = () => setAction(null);

  const confirmDelete = async () => {
    if (!selected || blocked(selected)) return;
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
      <ExpenseDetailSheet
        returnFocusRef={returnFocusRef}
        expense={selected}
        isOpen={action === "detail"}
        onClose={close}
      />
      <ExpenseFormSheet
        returnFocusRef={returnFocusRef}
        expense={selected}
        isOpen={action === "edit"}
        onClose={close}
      />
      <ConfirmDialog
        returnFocusRef={returnFocusRef}
        isOpen={action === "delete"}
        title={messages.Expense.delete_confirm_title}
        description={messages.Expense.delete_confirm_description}
        confirmLabel={messages.Expense.delete_confirm_button}
        isDestructive
        preview={
          selected
            ? { title: expenseDisplay(selected).title, amount: expenseAmountLabel(selected.amount) }
            : undefined
        }
        onConfirm={() => void confirmDelete()}
        onClose={close}
      />
    </>
  );
}
