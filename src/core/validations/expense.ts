import { z } from "zod";

export const expenseSchema = z.object({
	amount: z.number().int().min(1, "min_amount").max(100_000_000, "max_amount"),
	categoryId: z.string().min(1, "required_category"),
	title: z.string().trim().min(1, "required_title").max(80, "title_too_long"),
	description: z
		.string()
		.trim()
		.min(1, "required_description")
		.max(100, "description_too_long"),
	paymentType: z.enum(["cash", "debit_card", "credit_card"]),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;
