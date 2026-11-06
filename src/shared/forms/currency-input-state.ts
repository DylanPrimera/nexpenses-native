import { formatCOP, parseCOPInput } from "@/core/utils/currency";


export function sanitizeCurrencyText(raw: string): string {
  return raw.replace(/[^\d.]/g, "");
}

export function parseCurrencyText(text: string): number {
  return parseCOPInput(sanitizeCurrencyText(text));
}

export function blurredCurrencyText(value: number): string {
  return value > 0 ? formatCOP(value) : "";
}

export function focusedCurrencyText(value: number): string {
  return value > 0 ? String(Math.round(value)) : "";
}
