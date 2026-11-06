/**
 * lib/currency.ts
 * COP (Colombian Peso) formatting & parsing utilities.
 *
 * In Colombian format the DOT (.) is the thousands separator.
 * COP has no meaningful decimal places in everyday use.
 *
 * Examples:
 *   parseCOPInput("20.000")  → 20000
 *   parseCOPInput("20000")   → 20000
 *   formatCOP(20000)         → "20.000"
 *   formatCOPCurrency(20000) → "$ 20.000"
 */

const COP_FORMATTER = new Intl.NumberFormat("es-CO", {
	maximumFractionDigits: 0,
});

const COP_CURRENCY_FORMATTER = new Intl.NumberFormat("es-CO", {
	style: "currency",
	currency: "COP",
	maximumFractionDigits: 0,
});

/**
 * Parse a user-entered COP string to a plain integer.
 * Accepts both "20.000" (with Colombian thousands dot) and "20000".
 */
export function parseCOPInput(raw: string): number {
	// Strip thousands separators (dots) then any remaining non-digit chars
	const clean = raw.replace(/\./g, "").replace(/[^\d]/g, "");
	if (!clean) return 0;
	return Number.parseInt(clean, 10);
}

/**
 * Format a plain integer as a Colombian thousands string.
 * 20000 → "20.000"
 */
export function formatCOP(amount: number): string {
	if (!Number.isFinite(amount)) return "0";
	return COP_FORMATTER.format(Math.round(amount));
}

/**
 * Format a plain integer as a COP currency string.
 * 20000 → "$ 20.000"
 */
export function formatCOPCurrency(amount: number): string {
	if (!Number.isFinite(amount)) return "$ 0";
	return COP_CURRENCY_FORMATTER.format(Math.round(amount));
}
