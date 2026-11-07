import type { NewsItem, OnboardingPhase, PersistedOnboarding, TourStatus } from "../interfaces";

export const EMPTY_ONBOARDING: PersistedOnboarding = {
  tourVersion: null,
  tourStatus: null,
  dismissedNews: [],
};

function isTourStatus(value: unknown): value is TourStatus {
  return value === "completed" || value === "skipped";
}

export function parseOnboarding(raw: string | null): PersistedOnboarding {
  if (!raw) return EMPTY_ONBOARDING;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return EMPTY_ONBOARDING;
    const { tourVersion, tourStatus, dismissedNews } = parsed as Record<string, unknown>;
    const decided = typeof tourVersion === "string" && isTourStatus(tourStatus);
    return {
      tourVersion: decided ? tourVersion : null,
      tourStatus: decided ? tourStatus : null,
      dismissedNews: Array.isArray(dismissedNews)
        ? dismissedNews.filter((id): id is string => typeof id === "string")
        : [],
    };
  } catch {
    return EMPTY_ONBOARDING;
  }
}

export function isTourDecided(state: PersistedOnboarding, version: string) {
  return state.tourVersion === version && state.tourStatus !== null;
}

export function withTourStatus(
  state: PersistedOnboarding,
  version: string,
  status: TourStatus,
): PersistedOnboarding {
  return { ...state, tourVersion: version, tourStatus: status };
}

export function pendingNews(state: PersistedOnboarding, catalog: readonly NewsItem[]) {
  const dismissed = new Set(state.dismissedNews);
  return catalog.filter((item) => !dismissed.has(item.id));
}

export function withDismissedNews(
  state: PersistedOnboarding,
  ids: readonly string[],
): PersistedOnboarding {
  return { ...state, dismissedNews: [...new Set([...state.dismissedNews, ...ids])] };
}

export function desiredPhase({
  persisted,
  tourVersion,
  news,
}: {
  persisted: PersistedOnboarding;
  tourVersion: string;
  news: readonly NewsItem[];
}): OnboardingPhase {
  if (!isTourDecided(persisted, tourVersion)) return "offer";
  return pendingNews(persisted, news).length > 0 ? "news" : "idle";
}

export function canRunOnboarding({
  hydrated,
  authenticated,
  budgetReady,
  dashboardMounted,
  overlaysOpen,
  keyboardVisible,
}: {
  hydrated: boolean;
  authenticated: boolean;
  budgetReady: boolean;
  dashboardMounted: boolean;
  overlaysOpen: number;
  keyboardVisible: boolean;
}) {
  return (
    hydrated &&
    authenticated &&
    budgetReady &&
    dashboardMounted &&
    overlaysOpen === 0 &&
    !keyboardVisible
  );
}
