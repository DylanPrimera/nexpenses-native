export interface AmortizationRow {
  number: number;
  payment: number;
  interest: number;
  capital: number;
  balance: number;
}

export interface AmortizationResult {
  rows: AmortizationRow[];
  stalled: boolean;
}

export interface PayoffProjection {
  months: number;
  totalPaid: number;
  totalInterest: number;
  totalCapital: number;
  stalled: boolean;
}

const MAX_MONTHS = 600;

export function resolveMonthlyRate(rateMv: number | null, rateEa: number | null): number | null {
  if (rateMv != null) return rateMv / 100;
  if (rateEa != null) return (1 + rateEa / 100) ** (1 / 12) - 1;
  return null;
}

export function buildAmortization(input: {
  balance: number;
  payment: number;
  monthlyRate: number;
  startNumber?: number;
  maxRows?: number;
}): AmortizationResult {
  const rows: AmortizationRow[] = [];
  let remaining = Math.max(0, Math.round(input.balance));
  const payBase = Math.max(0, Math.round(input.payment));
  const max = input.maxRows ?? MAX_MONTHS;
  const start = input.startNumber ?? 1;
  const rate = Number.isFinite(input.monthlyRate) ? Math.max(0, input.monthlyRate) : 0;

  if (remaining <= 0) return { rows, stalled: false };
  if (payBase <= 0) return { rows, stalled: true };

  for (let i = 0; i < max && remaining > 0; i++) {
    const interest = Math.round(remaining * rate);
    if (payBase <= interest) return { rows, stalled: true };
    const applied = Math.min(payBase, remaining + interest);
    const capital = applied - interest;
    remaining = Math.max(0, remaining - capital);
    rows.push({ number: start + i, payment: applied, interest, capital, balance: remaining });
  }

  return { rows, stalled: remaining > 0 };
}

export function summarize(result: AmortizationResult): PayoffProjection {
  const totalPaid = result.rows.reduce((sum, row) => sum + row.payment, 0);
  const totalInterest = result.rows.reduce((sum, row) => sum + row.interest, 0);
  const totalCapital = result.rows.reduce((sum, row) => sum + row.capital, 0);
  return {
    months: result.rows.length,
    totalPaid,
    totalInterest,
    totalCapital,
    stalled: result.stalled,
  };
}

export function projectFixedPayment(
  balance: number,
  payment: number,
  monthlyRate: number,
): PayoffProjection {
  return summarize(buildAmortization({ balance, payment, monthlyRate }));
}

function closesWithin(
  principal: number,
  payment: number,
  monthlyRate: number,
  months: number,
): boolean {
  const result = projectFixedPayment(principal, payment, monthlyRate);
  return (
    !result.stalled &&
    result.months > 0 &&
    result.months <= months &&
    result.totalCapital >= principal
  );
}

export function paymentToCloseInMonths(
  balance: number,
  monthlyRate: number,
  months: number,
): number {
  const principal = Math.max(0, Math.round(balance));
  const n = Math.round(months);
  if (principal === 0 || n <= 0) return 0;
  if (monthlyRate <= 0) return Math.ceil(principal / n);
  const growth = (1 + monthlyRate) ** n;
  const formula =
    !Number.isFinite(growth) || growth === 1
      ? Math.ceil(principal / n)
      : Math.ceil((principal * monthlyRate * growth) / (growth - 1));
  let lo = Math.max(1, formula);
  let hi = Math.max(lo, Math.ceil(principal * (1 + Math.max(0, monthlyRate))) + 1);
  if (!closesWithin(principal, hi, monthlyRate, n)) return hi;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (closesWithin(principal, mid, monthlyRate, n)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export function payoffProgress(input: {
  originalAmount: number | null;
  balance: number;
  installmentNumber: number | null;
  installmentCount: number | null;
}): number | null {
  if (input.originalAmount != null && input.originalAmount > 0) {
    return clampPercent(((input.originalAmount - input.balance) / input.originalAmount) * 100);
  }
  if (
    input.installmentCount != null &&
    input.installmentCount > 0 &&
    input.installmentNumber != null
  ) {
    return clampPercent((Math.max(0, input.installmentNumber - 1) / input.installmentCount) * 100);
  }
  return null;
}

export function limitUtilization(
  creditLimit: number | null,
  availableLimit: number | null,
): number | null {
  if (creditLimit == null || creditLimit <= 0 || availableLimit == null) return null;
  return clampPercent(((creditLimit - availableLimit) / creditLimit) * 100);
}
