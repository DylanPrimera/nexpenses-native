import { create } from "zustand";
import type { OnboardingPhase, PersistedOnboarding, TourStatus } from "../interfaces";
import { EMPTY_ONBOARDING, withDismissedNews, withTourStatus } from "../lib/onboarding-state";
import { readOnboarding, saveOnboarding } from "../lib/onboarding-storage";
import { tourVersionOf } from "../lib/tour-version";

interface OnboardingState {
  hydratedUserId: string | null;
  persisted: PersistedOnboarding;
  phase: OnboardingPhase;
  replay: boolean;
  replayRequested: boolean;
  newsShown: boolean;

  hydrate: (userId: string) => Promise<void>;
  setPhase: (phase: OnboardingPhase) => void;
  startTour: () => void;
  requestReplay: () => void;
  startReplay: () => void;
  finishTour: (status: TourStatus) => void;
  dismissNews: (ids: readonly string[]) => void;
  resetSession: () => void;
}

const INITIAL = {
  hydratedUserId: null,
  persisted: EMPTY_ONBOARDING,
  phase: "idle",
  replay: false,
  replayRequested: false,
  newsShown: false,
} as const;

let hydrationTarget: string | null = null;

export const useOnboardingStore = create<OnboardingState>()((set, get) => {
  const persist = (next: PersistedOnboarding) => {
    const { hydratedUserId } = get();
    set({ persisted: next });
    if (hydratedUserId) void saveOnboarding(hydratedUserId, next);
  };

  return {
    ...INITIAL,

    hydrate: async (userId) => {
      if (get().hydratedUserId === userId) return;
      hydrationTarget = userId;
      const persisted = await readOnboarding(userId);
      if (hydrationTarget !== userId) return;
      set({ ...INITIAL, hydratedUserId: userId, persisted });
    },

    setPhase: (phase) => set({ phase }),

    startTour: () => set({ replay: false, phase: "tour" }),

    requestReplay: () => set({ replayRequested: true }),

    startReplay: () => set({ replayRequested: false, replay: true, phase: "tour" }),

    finishTour: (status) => {
      if (!get().replay) persist(withTourStatus(get().persisted, tourVersionOf(), status));
      set({ phase: "idle", replay: false });
    },

    dismissNews: (ids) => {
      persist(withDismissedNews(get().persisted, ids));
      set({ phase: "idle", newsShown: true });
    },

    resetSession: () => {
      hydrationTarget = null;
      set(INITIAL);
    },
  };
});
