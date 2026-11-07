import { messages } from "@/shared/i18n";
import type { ExpenseReportLabels } from "./expense-report";

const s = messages.Settings;

export const EXPENSE_REPORT_LABELS: ExpenseReportLabels = {
  sheetExpenses: s.export_sheet_expenses,
  sheetByCategory: s.export_sheet_by_category,
  sheetSummary: s.export_sheet_summary,
  colDate: s.export_col_date,
  colTime: s.export_col_time,
  colDescription: s.export_col_description,
  colCategory: s.export_col_category,
  colPayment: s.export_col_payment,
  colAmount: s.export_col_amount,
  colCount: s.export_col_count,
  colTotal: s.export_col_total,
  colPercent: s.export_col_percent,
  unknownCategory: s.export_unknown_category,
  labelExportedAt: s.export_label_exported_at,
  labelPeriod: s.export_label_period,
  labelBudget: s.export_label_budget,
  labelSpent: s.export_label_spent,
  labelRemaining: s.export_label_remaining,
  labelPercentUsed: s.export_label_percent_used,
  labelExpenseCount: s.export_label_expense_count,
  labelByPayment: s.export_label_by_payment,
};

export const PAYMENT_REPORT_LABELS = messages.PaymentType;
