import type { Icon as TablerIconType } from "@tabler/icons-react-native";

export type TourStatus = "completed" | "skipped";

export type OnboardingPhase = "idle" | "offer" | "tour" | "news";

export interface PersistedOnboarding {
  tourVersion: string | null;
  tourStatus: TourStatus | null;
  dismissedNews: string[];
}

export interface TourStepDefinition {
  id: string;
  icon: TablerIconType;
  title: string;
  description: string;
  emptyDescription?: string;
  targetId?: string;
  position?: "top" | "bottom" | "auto";
  borderRadius?: number;
}

export interface NewsItem {
  id: string;
  icon: TablerIconType;
  badge: string;
  title: string;
  body: string;
  where: string;
}
