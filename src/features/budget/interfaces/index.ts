export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  budget: number;
  cycleStartedAt: string;
}

export interface CycleSummary {
  budget: number;
  spent: number;
  expenseCount: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
  cycleStartedAt: string;
  daysLeft: number;
  daysElapsed: number;
  isCycleStale: boolean;
}

export interface UpdateBudgetInput {
  budget: number;
  cycleStartedAt?: string;
}

export const BUDGET_PATHS = {
  me: "/users/me",
  summary: "/summary",
} as const;
