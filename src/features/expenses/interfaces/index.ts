import type { PaymentType } from "@/core/types/domain";

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
}

export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  category?: ExpenseCategory | null;
  title: string | null;
  description: string | null;
  paymentType: PaymentType;
  date: string;
  creditId: string | null;
}

export interface ExpenseListResponse {
  items: Expense[];
  total: number;
  totalAmount: number;
  limit: number;
  offset: number;
}

export interface ExpenseInput {
  amount: number;
  categoryId: string;
  title: string;
  description: string;
  paymentType: PaymentType;
  saveAsRecurring?: boolean;
}

export const EXPENSE_PATHS = {
  list: "/expenses",
  detail: (id: string) => `/expenses/${id}`,
} as const;

export const CYCLE_EXPENSES_LIMIT = 100;
