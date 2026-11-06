import type { PaymentType } from "@/core/types/domain";

export interface RecurringExpense {
  id: string;
  amount: number;
  categoryId: string;
  title: string;
  description: string;
  paymentType: PaymentType;
  createdAt: string;
  category?: { id: string; name: string; color: string } | null;
}

export interface RecurringList {
  items: RecurringExpense[];
  total: number;
  limit: number;
  offset: number;
}

export const RECURRING_PATHS = {
  list: "/expenses/recurring",
  detail: (id: string) => `/expenses/recurring/${id}`,
} as const;

export const RECURRING_PAGE_LIMIT = 100;
