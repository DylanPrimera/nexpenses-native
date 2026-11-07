import type { Credit } from "@/core/types/domain";
import {
  buildAmortization,
  limitUtilization,
  payoffProgress,
  projectFixedPayment,
  resolveMonthlyRate,
  summarize,
  type PayoffProjection,
} from "./credit-calculations";

export function projectionModel(credit: Credit) {
  const rate = resolveMonthlyRate(credit.rateMv, credit.rateEa);
  const monthlyRate = rate ?? 0;
  const balance = credit.kind === "TC" && credit.totalDebt > 0 ? credit.totalDebt : credit.balance;
  const baselinePayment = credit.kind === "TC" ? credit.minPayment : (credit.installment ?? 0);
  const schedule =
    credit.kind === "CONSUMO" && baselinePayment > 0
      ? buildAmortization({
          balance,
          payment: baselinePayment,
          monthlyRate,
          startNumber: credit.installmentNumber ?? 1,
        })
      : null;
  const baseline =
    baselinePayment <= 0
      ? null
      : schedule
        ? summarize(schedule)
        : projectFixedPayment(balance, baselinePayment, monthlyRate);
  const payoffNow: PayoffProjection = {
    months: 0,
    totalPaid: balance,
    totalInterest: 0,
    totalCapital: balance,
    stalled: false,
  };
  const progress =
    credit.kind === "CONSUMO"
      ? payoffProgress(credit)
      : limitUtilization(credit.creditLimit, credit.availableLimit);
  const capital = baseline?.totalCapital ?? 0;
  const interest = baseline?.totalInterest ?? 0;
  const mixTotal = capital + interest;

  return {
    monthlyRate,
    hasRate: rate != null,
    balance,
    baselinePayment,
    schedule,
    baseline,
    payoffNow,
    progress,
    capital,
    interest,
    mixTotal,
    capitalPct: mixTotal > 0 ? (capital / mixTotal) * 100 : 0,
  };
}

export type ProjectionModel = ReturnType<typeof projectionModel>;
