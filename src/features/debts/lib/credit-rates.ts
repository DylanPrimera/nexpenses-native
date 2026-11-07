export const RATE_MAX = 999;

export function parseRateInput(raw: string): number | null {
  const trimmed = raw.trim().replace("%", "").replace(",", ".");
  if (!trimmed) return null;
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value < 0 || value > RATE_MAX) return Number.NaN;
  return value;
}

export function rateInputValue(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "";
  return String(value);
}

export function isValidRateInput(raw: string): boolean {
  return !Number.isNaN(parseRateInput(raw));
}

const RATE_FORMATTER = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 2 });

export function formatRate(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return `${RATE_FORMATTER.format(value)} %`;
}
