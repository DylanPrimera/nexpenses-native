import { z } from "zod";

export const MIN_BUDGET = 10_000;
export const MAX_BUDGET = 100_000_000;
/** Longest common given names fit; blocks a second name. */
export const FIRST_NAME_MAX = 20;

export const budgetSchema = z.object({
	amount: z
		.number()
		.int()
		.min(MIN_BUDGET, "min_budget")
		.max(MAX_BUDGET, "max_budget"),
});

export const budgetSetupSchema = budgetSchema;

export type BudgetFormData = z.infer<typeof budgetSchema>;
export type BudgetSetupFormData = z.infer<typeof budgetSetupSchema>;
