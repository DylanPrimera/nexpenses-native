import { useAuthStore } from "@/features/auth";
import { useProfile } from "@/features/budget";
import { useOverlayStore } from "@/shared/overlays";
import { useKeyboardVisible } from "@/shared/navigation/use-keyboard-visible";
import { TOUR_TARGETS, useTourTargetStore } from "@/shared/tour";
import { canRunOnboarding } from "../lib/onboarding-state";
import { useOnboardingStore } from "../store/onboarding.store";

export function useOnboardingGate() {
  const { status, userId } = useAuthStore();
  const { hydratedUserId } = useOnboardingStore();
  const profile = useProfile();
  const dashboardMounted = useTourTargetStore((state) => TOUR_TARGETS.budget in state.targets);
  const overlaysOpen = useOverlayStore((state) => state.openCount);
  const keyboardVisible = useKeyboardVisible();

  return canRunOnboarding({
    hydrated: !!userId && hydratedUserId === userId,
    authenticated: status === "authenticated",
    budgetReady: (profile.data?.budget ?? 0) > 0,
    dashboardMounted,
    overlaysOpen,
    keyboardVisible,
  });
}
