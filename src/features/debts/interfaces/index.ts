import type { CreditKind } from "@/core/types/domain";

export interface ApiCredit {
  id: string;
  kind: CreditKind;
  bankName: string | null;
  displayName: string | null;
  nextPaymentDate: string | null;
  cutoffDate: string | null;
  remainingBalance: number | string | null;
  minPayment: number | string | null;
  installmentAmount: number | string | null;
  installmentCurrent: number | string | null;
  installmentTotal: number | string | null;
  termMonths: number | string | null;
  creditLimit: number | string | null;
  availableCredit: number | string | null;
  originalAmount: number | string | null;
  rateEa: number | string | null;
  rateMv: number | string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ApiCreditList {
  items: ApiCredit[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreditsTotal {
  totalBalance: number;
}

export interface CreateCreditBody {
  kind: CreditKind;
  displayName: string;
  bankName: string;
  nextPaymentDate: string;
  remainingBalance: number;
  creditLimit?: number;
  cutoffDate?: string;
  minPayment?: number;
  installmentAmount?: number;
  installmentCurrent?: number;
  installmentTotal?: number;
  termMonths?: number;
  rateEa?: number;
  rateMv?: number;
}

export interface CreateCreditFromStatementInput {
  kind: CreditKind;
  displayName: string;
  file: { uri: string; name: string };
  rateEa: number | null;
  rateMv: number | null;
  signal?: AbortSignal;
  onUploadProgress?: (percent: number) => void;
}

export interface UpdateCreditBody {
  displayName?: string;
  rateEa?: number | null;
  rateMv?: number | null;
  remainingBalance?: number;
  creditLimit?: number | null;
}

export interface UpdateCreditInput {
  id: string;
  body: UpdateCreditBody;
}

export const CREDIT_PATHS = {
  list: "/credits",
  total: "/credits/total",
  statement: "/credits/from-statement",
  detail: (id: string) => `/credits/${id}`,
} as const;

export const MAX_CREDITS = 10;
export const CREDIT_PAGE_LIMIT = 100;
export const CREDIT_NAME_MAX = 80;

export const STATEMENT_TIMEOUT_MS = 120_000;
