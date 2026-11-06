import type { PaymentType } from "@/core/types/domain";
import { formatCOPCurrency } from "@/core/utils/currency";
import { DEFAULT_CATEGORY_COLOR } from "@/features/categories/lib/category-colors";
import { messages } from "@/shared/i18n";
import type { Expense, ExpenseInput } from "../interfaces";
import type { ExpenseFormValues } from "../schemas";

export const PAYMENT_LABELS: Record<PaymentType, string> = {
  cash: messages.PaymentType.cash,
  debit_card: messages.PaymentType.debit_card,
  credit_card: messages.PaymentType.credit_card,
};

export function expenseDisplay(expense: Expense) {
  const categoryName = expense.category?.name ?? messages.Expense.category_general;
  const title = expense.title?.trim() || expense.description?.trim() || categoryName;
  const detail = expense.title?.trim() ? expense.description?.trim() || undefined : undefined;
  return {
    title,
    detail,
    categoryName,
    categoryColor: expense.category?.color ?? DEFAULT_CATEGORY_COLOR,
  };
}

export function expenseAmountLabel(amount: number): string {
  return `-${formatCOPCurrency(amount)} ${messages.Common.currency}`;
}

export function expenseFormValues(expense?: Expense | null): ExpenseFormValues {
  return {
    amount: expense?.amount ?? 0,
    categoryId: expense?.categoryId ?? "",
    title: expense?.title ?? "",
    description: expense?.description ?? "",
    paymentType: expense?.paymentType ?? "debit_card",
    source: "manual",
    recurringId: "",
    saveAsRecurring: false,
  };
}

export function expenseInput(values: ExpenseFormValues, creating = false): ExpenseInput {
  const input: ExpenseInput = {
    amount: values.amount,
    categoryId: values.categoryId,
    title: values.title.trim(),
    description: values.description.trim(),
    paymentType: values.paymentType,
  };
  if (creating && values.saveAsRecurring) input.saveAsRecurring = true;
  return input;
}

export function availableForExpense(remaining: number, expense?: Expense | null): number {
  return remaining + (expense?.amount ?? 0);
}

export function overBudgetExcess(amount: number, available: number): number {
  if (amount <= 0 || amount <= available) return 0;
  return amount - Math.max(0, available);
}

export function expenseSaveFeedback({ amount, available, editing }: { amount: number; available: number; editing: boolean }) {
  if (amount > available) {
    return {
      tone: "warning" as const,
      message: editing ? messages.Expense.updated_over_budget_toast : messages.Expense.over_budget_toast,
    };
  }
  return {
    tone: "success" as const,
    message: editing ? messages.Expense.updated_toast : messages.Expense.success_toast,
  };
}
