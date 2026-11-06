/**
 * core/types/domain.ts
 * Shared TypeScript interfaces used across all Zustand store slices.
 */

export type CycleType = "monthly";

export type PaymentType = "cash" | "debit_card" | "credit_card";

/** TC = tarjeta de crédito. CONSUMO = crédito de consumo. */
export type CreditKind = "TC" | "CONSUMO";

/** Computed on the client when the debts list or detail is shown. */
export type CreditStatus = "al_dia" | "proximo" | "atrasado";

export interface Credit {
	id: string;
	kind: CreditKind;
	/** TC: nombre o banco. CONSUMO: tipo. */
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
	/** Percent points, e.g. 28.5 means 28.5% EA. */
	rateEa: number | null;
	/** Percent points, e.g. 2.1 means 2.1% MV. */
	rateMv: number | null;
	originalAmount: number | null;
	createdAt: string;
	updatedAt: string;
}

export interface Budget {
	id: string;
	amount: number; // COP integer
	displayName?: string;
	cycleType: CycleType;
	/** ISO instant the current cycle (payday) started; expenses on/after it count. */
	cycleStartedAt: string;
	updatedAt: string;
}

export interface Category {
	id: string;
	name: string; // normalized: trimmed + lowercase
	color: string; // hex, auto-assigned from palette
	createdAt: string;
	usageCount: number; // incremented on each expense use
}

export interface Expense {
	id: string;
	amount: number; // COP integer
	categoryId: string;
	title?: string;
	description?: string;
	paymentType: PaymentType;
	date: string; // ISO datetime — auto-set on creation
	/** Set when the expense is a credit installment. Absent after the credit is removed. */
	creditId?: string;
}

/** Reusable payment template. Not a credit installment and not an expense. */
export interface RecurringExpenseTemplate {
	id: string;
	amount: number;
	categoryId: string;
	title: string;
	description: string;
	paymentType: PaymentType;
	categoryName?: string;
}

/** Derived summary for the current cycle — never persisted */
export interface CycleSummary {
	spent: number;
	remaining: number;
	percentage: number; // 0–100+, can exceed 100 if over budget
	cycleStart: string; // ISO — budget.cycleStartedAt
	cycleEnd: string; // ISO — expected end (one month later); real end is the next budget
	daysLeft: number; // until the expected end, counting today; 0 once passed
	daysElapsed: number;
	isOverBudget: boolean;
	isStale: boolean; // STALE_CYCLE_DAYS+ without a new budget
}
