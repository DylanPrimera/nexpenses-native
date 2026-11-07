import type { Credit, CreditKind } from "@/core/types/domain";
import { messages } from "@/shared/i18n";
import type { ApiCredit } from "../interfaces";

function toNumber(value: number | string | null | undefined): number | null {
  if (value == null || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function toInt(value: number | string | null | undefined): number | null {
  const parsed = toNumber(value);
  return parsed == null ? null : Math.round(parsed);
}

function cleanText(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function toKind(value: string | null | undefined): CreditKind {
  return value === "CONSUMO" ? "CONSUMO" : "TC";
}

export function dayOf(value: string | null | undefined): string | null {
  const text = cleanText(value);
  if (!text) return null;
  const day = text.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : null;
}

export function mapApiCredit(api: ApiCredit): Credit {
  const kind = toKind(api.kind);
  const bank = cleanText(api.bankName);
  const totalDebt = toInt(api.remainingBalance) ?? 0;
  const creditLimit = toInt(api.creditLimit);
  const availableFromApi = toInt(api.availableCredit);
  const minPayment = toInt(api.minPayment);
  const now = new Date().toISOString();

  return {
    id: api.id,
    kind,
    displayName: cleanText(api.displayName) ?? bank ?? messages.Debts.fallback_name,
    bank,
    totalDebt,
    minPayment: minPayment ?? 0,
    availableLimit:
      availableFromApi ?? (creditLimit != null ? Math.max(0, creditLimit - totalDebt) : null),
    creditLimit,
    installment: toInt(api.installmentAmount) ?? (kind === "CONSUMO" ? minPayment : null),
    balance: totalDebt,
    installmentNumber: toInt(api.installmentCurrent),
    installmentCount: toInt(api.installmentTotal) ?? toInt(api.termMonths),
    dueDate: dayOf(api.nextPaymentDate),
    rateEa: toNumber(api.rateEa),
    rateMv: toNumber(api.rateMv),
    originalAmount: toInt(api.originalAmount),
    createdAt: api.createdAt ?? now,
    updatedAt: api.updatedAt ?? now,
  };
}
