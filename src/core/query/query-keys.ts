export const queryKeys = {
  auth: {
    login: ["auth", "login"] as const,
    register: ["auth", "register"] as const,
  },
  user: {
    profile: ["user", "profile"] as const,
  },
  summary: {
    cycle: (cycleKey: string) => ["summary", cycleKey] as const,
  },
  expenses: {
    cycle: (cycleKey: string) => ["expenses", "cycle", cycleKey] as const,
  },
};
