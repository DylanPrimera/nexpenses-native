export const queryKeys = {
  auth: {
    login: ["auth", "login"] as const,
    register: ["auth", "register"] as const,
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
  },
  categories: {
    all: ["categories"] as const,
  },
};
