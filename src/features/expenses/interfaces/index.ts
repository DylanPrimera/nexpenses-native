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
  creditId?: string | null;
  advanceInstallment?: true;
}

export interface UpdateExpenseInput {
  id: string;
  input: ExpenseInput;
  previousCreditId?: string | null;
}

export interface DeleteExpenseInput {
  id: string;
  creditId?: string | null;
}

export const EXPENSE_PATHS = {
  list: "/expenses",
  detail: (id: string) => `/expenses/${id}`,
} as const;

export const CYCLE_EXPENSES_LIMIT = 100;

export interface CreateExpenseInput extends ExpenseInput {
  id: string;
  date: string;
}
export interface CreateExpenseVariables {
  userId: string;
  input: CreateExpenseInput;
  optimisticExpense: Expense;
}
export interface PendingExpense {
  userId: string;
  expense: Expense;
}

export interface ExpenseReceipt {
  expense: Expense;
  acknowledgedAt: number;
}
