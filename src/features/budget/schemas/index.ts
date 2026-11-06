import { messages } from "@/shared/i18n";
import { z } from "zod";

export const MIN_BUDGET = 10_000;
export const MAX_BUDGET = 100_000_000;

export const budgetSchema = z.object({
  amount: z
    .number({ error: messages.Budget.validation_required })
    .int(messages.Budget.validation_required)
    .positive(messages.Budget.validation_required)
    .min(MIN_BUDGET, messages.Budget.validation_min)
    .max(MAX_BUDGET, messages.Budget.validation_max),
});

export type BudgetAmountValues = z.infer<typeof budgetSchema>;

export type BudgetFormValues = BudgetAmountValues & {
  cycleDay: string;
  isNewCycle: boolean;
};
