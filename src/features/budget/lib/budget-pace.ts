export type BudgetPace = "over" | "warning" | "healthy";

export const PACE_WARNING_PERCENT = 85;

export function budgetPace(percentage: number, isOverBudget: boolean): BudgetPace {
  if (isOverBudget) return "over";
  if (percentage >= PACE_WARNING_PERCENT) return "warning";
  return "healthy";
}

export function dailyAllowance(remaining: number, daysLeft: number): number {
  if (daysLeft <= 0 || remaining <= 0) return 0;
  return Math.round(remaining / daysLeft);
}

export function progressWidth(percentage: number): number {
  return Math.min(Math.max(percentage, 0), 100);
}
