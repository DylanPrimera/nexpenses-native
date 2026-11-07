import { apiClient } from "@/core/api/api-client";
import { EXPENSE_PATHS, type ExpenseListResponse } from "@/features/expenses/interfaces";

export type ExportPageParams = {
  limit: number;
  offset: number;
  year?: number;
  month?: number;
};

export async function getExportPageAction(params: ExportPageParams): Promise<ExpenseListResponse> {
  const { data } = await apiClient.get<ExpenseListResponse>(EXPENSE_PATHS.list, { params });
  return data;
}
