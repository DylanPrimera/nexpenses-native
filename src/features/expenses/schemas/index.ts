import { messages } from "@/shared/i18n";
import { z } from "zod";

export const MAX_EXPENSE_AMOUNT = 100_000_000;
export const EXPENSE_TITLE_MAX = 80;
export const EXPENSE_DESCRIPTION_MAX = 100;

export const expenseSchema = z
  .object({
    amount: z
      .number({ error: messages.Expense.validation_amount })
      .int(messages.Expense.validation_amount)
      .positive(messages.Expense.validation_amount)
      .max(MAX_EXPENSE_AMOUNT, messages.Expense.validation_amount),
    categoryId: z.string().min(1, messages.Expense.validation_category),
    title: z.string().trim().min(1, messages.Expense.validation_title).max(EXPENSE_TITLE_MAX),
    description: z.string().trim().min(1, messages.Expense.validation_description).max(EXPENSE_DESCRIPTION_MAX),
    paymentType: z.enum(["cash", "debit_card", "credit_card"]),
    source: z.enum(["manual", "recurring", "notice", "credit"]),
    recurringId: z.string(),
    creditId: z.string(),
    creditKind: z.enum(["TC", "CONSUMO"]),
    saveAsRecurring: z.boolean(),
  })
  .refine((values) => values.source !== "recurring" || values.recurringId !== "", {
    message: messages.Expense.recurring_required,
    path: ["recurringId"],
  })
  .refine((values) => values.source !== "credit" || values.creditId !== "", {
    message: messages.Expense.credit_required,
    path: ["creditId"],
  })
  .refine((values) => values.source !== "credit" || values.paymentType !== "credit_card", {
    message: messages.Expense.credit_card_blocked,
    path: ["paymentType"],
  });

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
