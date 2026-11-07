import type { Credit, CreditKind } from "@/core/types/domain";
import type { CreateCreditBody, UpdateCreditBody } from "../interfaces";
import { parseRateInput, rateInputValue } from "./credit-rates";
import type { CreditCreateValues, CreditEditValues } from "../schemas";

export function creditEditValues(credit: Credit): CreditEditValues {
  return {
    displayName: credit.displayName,
    rateEa: rateInputValue(credit.rateEa),
    rateMv: rateInputValue(credit.rateMv),
    remainingBalance: credit.totalDebt,
    creditLimit: credit.creditLimit ?? 0,
  };
}

export function creditUpdateBody(credit: Credit, values: CreditEditValues): UpdateCreditBody {
  return {
    displayName: values.displayName.trim(),
    rateEa: parseRateInput(values.rateEa),
    rateMv: parseRateInput(values.rateMv),
    ...(credit.kind === "TC"
      ? {
          remainingBalance: Math.round(values.remainingBalance),
          creditLimit: Math.round(values.creditLimit),
        }
      : {}),
  };
}

export const emptyCreditCreateValues: CreditCreateValues = {
  displayName: "",
  bankName: "",
  remainingBalance: 0,
  creditLimit: 0,
  dueDate: "",
  cutoffDate: "",
  minPayment: 0,
  installment: 0,
  installmentCurrent: "",
  termMonths: "",
  rateEa: "",
  rateMv: "",
};

function optionalPositive(value: number) {
  return value > 0 ? Math.round(value) : undefined;
}

export function creditCreateBody(kind: CreditKind, values: CreditCreateValues): CreateCreditBody {
  const isLoan = kind === "CONSUMO";
  const rateEa = parseRateInput(values.rateEa);
  const rateMv = parseRateInput(values.rateMv);
  const current = values.installmentCurrent.trim() ? Number(values.installmentCurrent) : undefined;
  const term = values.termMonths.trim() ? Number(values.termMonths) : undefined;
  return {
    kind,
    displayName: values.displayName.trim(),
    bankName: values.bankName.trim(),
    nextPaymentDate: values.dueDate,
    remainingBalance: Math.round(values.remainingBalance),
    ...(isLoan
      ? { installmentAmount: Math.round(values.installment) }
      : { minPayment: Math.round(values.minPayment) }),
    ...(!isLoan && optionalPositive(values.creditLimit)
      ? { creditLimit: optionalPositive(values.creditLimit) }
      : {}),
    ...(!isLoan && values.cutoffDate ? { cutoffDate: values.cutoffDate } : {}),
    ...(current !== undefined ? { installmentCurrent: current } : {}),
    ...(term !== undefined ? { installmentTotal: term, termMonths: term } : {}),
    ...(rateEa !== null ? { rateEa } : {}),
    ...(rateMv !== null ? { rateMv } : {}),
  };
}
