export const queryKeys = {
  auth: {
    login: ["auth", "login"] as const,
    register: ["auth", "register"] as const,
    google: ["auth", "google"] as const,
  },
  user: {
    profile: ["user", "profile"] as const,
  },
  summary: {
    all: ["summary"] as const,
    cycle: ["summary", "cycle"] as const,
  },
  expenses: {
    all: ["expenses"] as const,
    cycle: (cycleStartedAt: string) => ["expenses", "cycle", cycleStartedAt] as const,
    export: (scopeKey: string) => ["expenses", "export", scopeKey] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
  credits: {
    all: ["credits"] as const,
    list: ["credits", "list"] as const,
    detail: (id: string) => ["credits", "detail", id] as const,
    total: ["credits", "total"] as const,
  },
  recurring: {
    all: ["recurring"] as const,
  },
  history: {
    all: ["history"] as const,
    list: (
      { year, month }: { year: number; month: number },
      { categoryId, paymentType, search }: { categoryId: string; paymentType: string; search: string },
    ) => ["history", "list", year, month, categoryId, paymentType, search.trim()] as const,
    month: ({ year, month }: { year: number; month: number }) => ["history", "month", year, month] as const,
    count: ({ year, month }: { year: number; month: number }) => ["history", "count", year, month] as const,
  },
};
