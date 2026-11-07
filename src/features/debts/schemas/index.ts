import type { CreditKind } from "@/core/types/domain";
import { messages } from "@/shared/i18n";
import { z } from "zod";
import { CREDIT_NAME_MAX } from "../interfaces";
import { isValidRateInput } from "../lib/credit-rates";

const MAX_AMOUNT = 1_000_000_000_000;

const rateField = z.string().refine(isValidRateInput, messages.Debts.validation_rate);

const nameField = z.string().trim().min(1, messages.Debts.validation_name).max(CREDIT_NAME_MAX);

const moneyField = (message: string) =>
  z.number({ error: message }).int(message).min(0, message).max(MAX_AMOUNT, message);

const baseEdit = z.object({
  displayName: nameField,
  rateEa: rateField,
  rateMv: rateField,
});

const cardEdit = baseEdit.extend({
  remainingBalance: moneyField(messages.Debts.validation_balance),
  creditLimit: moneyField(messages.Debts.validation_credit_limit),
});

export function creditEditSchema(kind: CreditKind) {
  return kind === "TC" ? cardEdit : baseEdit;
}

export type CreditEditValues = {
  displayName: string;
  rateEa: string;
  rateMv: string;
  remainingBalance: number;
  creditLimit: number;
};

export type CreditEntryMode = "statement" | "manual";

export type CreditCreateValues = {
  displayName: string;
  bankName: string;
  remainingBalance: number;
  creditLimit: number;
  dueDate: string;
  cutoffDate: string;
  minPayment: number;
  installment: number;
  installmentCurrent: string;
  termMonths: string;
  rateEa: string;
  rateMv: string;
};

const MAX_TERM_MONTHS = 600;

const positiveMoney = (message: string) =>
  z.number({ error: message }).int(message).min(1, message).max(MAX_AMOUNT, message);

function positionField(required: boolean, message: string, max: number) {
  return z.string().refine((value) => {
    const text = value.trim();
    if (!text) return !required;
    const parsed = Number(text);
    return Number.isInteger(parsed) && parsed >= 1 && parsed <= max;
  }, message);
}

const statementCreate = z.object({
  displayName: nameField,
  rateEa: rateField,
  rateMv: rateField,
});

export function creditCreateSchema(kind: CreditKind, entryMode: CreditEntryMode) {
  if (entryMode === "statement") return statementCreate;
  const isLoan = kind === "CONSUMO";
  return statementCreate
    .extend({
      bankName: z.string().trim().min(1, messages.Debts.validation_bank_name).max(CREDIT_NAME_MAX),
      remainingBalance: moneyField(messages.Debts.validation_balance),
      creditLimit: moneyField(messages.Debts.validation_credit_limit),
      dueDate: z.string().min(1, messages.Debts.validation_due_date),
      cutoffDate: z.string(),
      minPayment: isLoan ? z.number() : positiveMoney(messages.Debts.validation_min_payment),
      installment: isLoan ? positiveMoney(messages.Debts.validation_installment) : z.number(),
      installmentCurrent: positionField(
        isLoan,
        messages.Debts.validation_installment_current,
        MAX_TERM_MONTHS,
      ),
      termMonths: positionField(isLoan, messages.Debts.validation_term_months, MAX_TERM_MONTHS),
    })
    .superRefine((values, ctx) => {
      const current = Number(values.installmentCurrent);
      const term = Number(values.termMonths);
      if (values.installmentCurrent.trim() && values.termMonths.trim() && current > term) {
        ctx.addIssue({
          code: "custom",
          path: ["installmentCurrent"],
          message: messages.Debts.validation_installment_current,
        });
      }
    });
}
