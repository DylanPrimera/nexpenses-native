export const DEFAULT_CATEGORY_COLOR = "#6366f1";

export function withAlpha(hex: string, alpha: number): string {
  const normalized = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : DEFAULT_CATEGORY_COLOR;
  const channel = Math.round(Math.min(Math.max(alpha, 0), 1) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${normalized}${channel}`;
}

export function normalizeCategoryName(name: string): string {
  return name.trim().toLowerCase();
}
