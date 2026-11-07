import type { Credit } from "@/core/types/domain";
import { formatCOPCurrency } from "@/core/utils/currency";
import { formatPickedDate } from "@/shared/components/ui/calendar-grid";
import { messages, tx } from "@/shared/i18n";
import { MAX_CREDITS } from "../interfaces";

export function creditMoney(amount: number | null | undefined): string {
  return amount == null ? "—" : formatCOPCurrency(amount);
}

export function formatDueDate(dueDate: string | null): string {
  if (!dueDate) return "—";
  return formatPickedDate(dueDate) || "—";
}

export function sortByDueDate(a: Credit, b: Credit): number {
  if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
  if (a.dueDate) return -1;
  if (b.dueDate) return 1;
  return a.displayName.localeCompare(b.displayName, "es");
}

export function groupCredits(credits: readonly Credit[]) {
  return {
    cards: credits.filter((credit) => credit.kind === "TC").sort(sortByDueDate),
    loans: credits.filter((credit) => credit.kind === "CONSUMO").sort(sortByDueDate),
  };
}

export function hasReachedCreditLimit(count: number): boolean {
  return count >= MAX_CREDITS;
}

export function creditOwed(credit: Credit): number {
  return credit.kind === "TC" ? credit.totalDebt : credit.balance;
}

export function installmentLabel(credit: Credit): string | null {
  if (
    credit.kind !== "CONSUMO" ||
    credit.installmentNumber == null ||
    credit.installmentCount == null
  )
    return null;
  return tx(messages.Debts.installment_nm, {
    current: credit.installmentNumber,
    total: credit.installmentCount,
  });
}

export function showsBank(credit: Credit): boolean {
  return (
    credit.kind === "TC" &&
    credit.bank != null &&
    credit.bank.toLowerCase() !== credit.displayName.toLowerCase()
  );
}

export function monthsLabel(count: number): string {
  return count === 1 ? messages.Debts.one_month : tx(messages.Debts.months, { count });
}

export function creditInstallmentAmount(credit: Credit): number {
  if (credit.kind === "TC") return Math.max(0, credit.minPayment);
  return Math.max(0, credit.installment ?? credit.minPayment ?? 0);
}
