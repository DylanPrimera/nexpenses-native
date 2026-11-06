import { DEFAULT_CATEGORY_COLOR } from "@/features/categories/lib/category-colors";
import { PAYMENT_LABELS } from "@/features/expenses/lib/expense-display";
import { messages } from "@/shared/i18n";
import type { RecurringExpense } from "../interfaces";

export function recurringDisplay(template: RecurringExpense) {
  return {
    categoryName: template.category?.name ?? messages.Expense.category_general,
    categoryColor: template.category?.color ?? DEFAULT_CATEGORY_COLOR,
    paymentLabel: PAYMENT_LABELS[template.paymentType],
  };
}
