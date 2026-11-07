export const TOUR_STEP_IDS = [
  "welcome",
  "budget",
  "add-expense",
  "recent",
  "history",
  "recurring",
  "categories",
  "debts",
  "settings",
  "account",
  "finish",
] as const;

export function tourVersionOf(ids: readonly string[] = TOUR_STEP_IDS) {
  return ids.join(">");
}
