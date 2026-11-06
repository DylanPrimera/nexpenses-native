import type { PaymentType } from "@/core/types/domain";
import type { Expense } from "@/features/expenses/interfaces";

export interface HistoryMonth {
  year: number;
  month: number;
}

export type PaymentFilter = PaymentType | "all";

export interface HistoryFilters {
  categoryId: string;
  paymentType: PaymentFilter;
  search: string;
}

export type HistoryView = "list" | "calendar";

export interface DayGroup {
  key: string;
  total: number;
  items: Expense[];
}

export interface HistoryQueryParams {
  year: number;
  month: number;
  categoryId?: string;
  paymentType?: PaymentType;
  search?: string;
  limit: number;
  offset: number;
}

export const HISTORY_PAGE_SIZE = 20;
export const HISTORY_MONTH_PAGE_LIMIT = 500;
export const HISTORY_SEARCH_MAX = 100;
