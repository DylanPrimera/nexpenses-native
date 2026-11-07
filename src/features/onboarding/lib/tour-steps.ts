import { messages } from "@/shared/i18n";
import { navTourTarget, TOUR_TARGETS } from "@/shared/tour/tour-targets";
import {
  IconCircleCheck,
  IconCreditCard,
  IconHistory,
  IconPlus,
  IconReceipt,
  IconRepeat,
  IconSettings,
  IconSparkles,
  IconTags,
  IconUserCircle,
  IconWallet,
} from "@tabler/icons-react-native";
import type { TourStepDefinition } from "../interfaces";

const steps = messages.Tour.steps;

export const TOUR_STEPS: readonly TourStepDefinition[] = [
  { id: "welcome", icon: IconSparkles, ...steps.welcome },
  {
    id: "budget",
    icon: IconWallet,
    targetId: TOUR_TARGETS.budget,
    position: "bottom",
    borderRadius: 14,
    ...steps.budget,
  },
  {
    id: "add-expense",
    icon: IconPlus,
    targetId: TOUR_TARGETS.fab,
    position: "top",
    borderRadius: 28,
    ...steps.add_expense,
  },
  {
    id: "recent",
    icon: IconReceipt,
    targetId: TOUR_TARGETS.recent,
    position: "auto",
    borderRadius: 14,
    ...steps.recent,
    emptyDescription: steps.recent.empty_description,
  },
  {
    id: "history",
    icon: IconHistory,
    targetId: navTourTarget("history"),
    position: "top",
    borderRadius: 20,
    ...steps.history,
  },
  {
    id: "recurring",
    icon: IconRepeat,
    targetId: navTourTarget("recurring"),
    position: "top",
    borderRadius: 20,
    ...steps.recurring,
  },
  {
    id: "categories",
    icon: IconTags,
    targetId: navTourTarget("categories"),
    position: "top",
    borderRadius: 20,
    ...steps.categories,
  },
  {
    id: "debts",
    icon: IconCreditCard,
    targetId: navTourTarget("debts"),
    position: "top",
    borderRadius: 20,
    ...steps.debts,
  },
  {
    id: "settings",
    icon: IconSettings,
    targetId: navTourTarget("settings"),
    position: "top",
    borderRadius: 20,
    ...steps.settings,
  },
  {
    id: "account",
    icon: IconUserCircle,
    targetId: TOUR_TARGETS.avatar,
    position: "bottom",
    borderRadius: 24,
    ...steps.account,
  },
  { id: "finish", icon: IconCircleCheck, ...steps.finish },
];

export function resolveTourSteps({
  registered,
  hasExpenses,
  steps = TOUR_STEPS,
}: {
  registered: ReadonlySet<string>;
  hasExpenses: boolean;
  steps?: readonly TourStepDefinition[];
}): TourStepDefinition[] {
  return steps
    .filter((step) => !step.targetId || registered.has(step.targetId))
    .map((step) =>
      !hasExpenses && step.emptyDescription
        ? { ...step, description: step.emptyDescription }
        : step,
    );
}
