import { useAuthStore } from "@/features/auth";
import { useCycleSummary } from "@/features/budget";
import { useCycleExpenses } from "@/features/expenses";
import { useTourTargetStore } from "@/shared/tour";
import { useEffect, useMemo, useRef } from "react";
import { AppState } from "react-native";
import { useTourEngine } from "../engine/tour-engine";
import { useOnboardingGate } from "../hooks/use-onboarding-gate";
import { NEWS_ITEMS } from "../lib/news-catalog";
import { desiredPhase, pendingNews } from "../lib/onboarding-state";
import { resolveTourSteps } from "../lib/tour-steps";
import { tourVersionOf } from "../lib/tour-version";
import { useOnboardingStore } from "../store/onboarding.store";
import { TourOfferSheet } from "./TourOfferSheet";
import { WhatsNewSheet } from "./WhatsNewSheet";

export function OnboardingHost() {
  const { userId } = useAuthStore();
  const {
    phase,
    persisted,
    newsShown,
    replayRequested,
    hydrate,
    setPhase,
    startTour,
    startReplay,
    finishTour,
    dismissNews,
  } = useOnboardingStore();
  const canRun = useOnboardingGate();
  const summary = useCycleSummary();
  const expenses = useCycleExpenses(summary.data?.cycleStartedAt);
  const { run, stop, pause, resume } = useTourEngine();
  const tourRunning = useRef(false);
  const news = useMemo(() => pendingNews(persisted, NEWS_ITEMS), [persisted]);
  const hasExpenses = (expenses.data?.length ?? 0) > 0;

  useEffect(() => {
    if (userId) void hydrate(userId);
  }, [userId, hydrate]);

  useEffect(() => {
    if (phase !== "idle" || !canRun) return;
    if (replayRequested) {
      startReplay();
      return;
    }
    const next = desiredPhase({ persisted, tourVersion: tourVersionOf(), news: NEWS_ITEMS });
    if (next === "news" && newsShown) return;
    if (next !== "idle") setPhase(next);
  }, [phase, canRun, replayRequested, persisted, newsShown, startReplay, setPhase]);

  useEffect(() => {
    if (phase !== "tour") {
      if (tourRunning.current) stop();
      tourRunning.current = false;
      return;
    }
    if (tourRunning.current || expenses.isLoading) return;
    tourRunning.current = true;
    const registered = new Set(Object.keys(useTourTargetStore.getState().targets));
    const steps = resolveTourSteps({ registered, hasExpenses });
    run(steps, (completed) => finishTour(completed ? "completed" : "skipped"));
  }, [phase, hasExpenses, expenses.isLoading, run, stop, finishTour]);

  useEffect(() => {
    if (phase !== "tour") return;
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "background") pause();
      else if (state === "active") resume();
    });
    return () => subscription.remove();
  }, [phase, pause, resume]);

  if (phase === "offer")
    return <TourOfferSheet onAccept={startTour} onDecline={() => finishTour("skipped")} />;
  if (phase === "news" && news.length > 0)
    return <WhatsNewSheet items={news} onClose={dismissNews} />;
  return null;
}
