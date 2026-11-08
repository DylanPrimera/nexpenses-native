export type CycleType = "monthly";

export type PaymentType = "cash" | "debit_card" | "credit_card";

export type CreditKind = "TC" | "CONSUMO";

export type CreditStatus = "al_dia" | "proximo" | "atrasado";

export interface Credit {
  id: string;
  kind: CreditKind;

  displayName: string;
  bank: string | null;
  totalDebt: number;
  minPayment: number;
  availableLimit: number | null;
  creditLimit: number | null;
  installment: number | null;
  balance: number;
  installmentNumber: number | null;
  installmentCount: number | null;
  dueDate: string | null;
  rateEa: number | null;
  rateMv: number | null;
  originalAmount: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  amount: number;
  displayName?: string;
  cycleType: CycleType;
  cycleStartedAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  usageCount: number;
}

export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  title?: string;
  description?: string;
  paymentType: PaymentType;
  date: string;
  creditId?: string;
}

export interface RecurringExpenseTemplate {
  id: string;
  amount: number;
  categoryId: string;
  title: string;
  description: string;
  paymentType: PaymentType;
  categoryName?: string;
}

export interface CycleSummary {
  spent: number;
  remaining: number;
  percentage: number;
  cycleStart: string;
  cycleEnd: string;
  daysLeft: number;
  daysElapsed: number;
  isOverBudget: boolean;
  isStale: boolean;
}
