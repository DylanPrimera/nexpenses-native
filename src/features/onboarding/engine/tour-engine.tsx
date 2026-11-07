import { messages } from "@/shared/i18n";
import { tx } from "@/shared/i18n/format";
import { TOUR_TARGETS, tourScrollOffset, useTourTargetStore } from "@/shared/tour";
import {
  TourGuideOverlay,
  TourGuideProvider,
  useTourGuide,
  type TourGuideConfig,
  type TourStep,
} from "@wrack/react-native-tour-guide";
import { useCallback, type ReactNode } from "react";
import { useReducedMotion } from "react-native-reanimated";
import type { TourStepDefinition } from "../interfaces";
import { TourTooltip } from "./TourTooltip";

const SPOTLIGHT_PADDING = 6;
const SCROLL_OFFSET = 24;
const SCROLLABLE_TARGETS = new Set<string>([TOUR_TARGETS.budget, TOUR_TARGETS.recent]);

function toTourStep(definition: TourStepDefinition, index: number, total: number): TourStep {
  const { targets, scroller } = useTourTargetStore.getState();
  const targetRef = definition.targetId ? targets[definition.targetId] : undefined;
  const scrollable =
    !!definition.targetId && SCROLLABLE_TARGETS.has(definition.targetId) && !!scroller;

  return {
    id: definition.id,
    targetRef,
    title: definition.title,
    description: definition.description,
    tooltipPosition: definition.position ?? "auto",
    spotlightPadding: SPOTLIGHT_PADDING,
    spotlightBorderRadius: definition.borderRadius,
    scrollToTarget: scrollable
      ? {
          scrollRef: scroller,
          offset: SCROLL_OFFSET,
          animated: true,
          getCurrentScrollOffset: () => tourScrollOffset.current,
        }
      : undefined,
    accessibilityLabel: `${tx(messages.Tour.progress, { current: index + 1, total })}. ${definition.title}. ${definition.description}`,
    renderTooltip: (props) => <TourTooltip {...props} icon={definition.icon} />,
  };
}

function scrollDashboardToTop() {
  const scroller = useTourTargetStore.getState().scroller?.current as
    { scrollTo?: (options: { y: number; animated: boolean }) => void } | null | undefined;
  scroller?.scrollTo?.({ y: 0, animated: true });
}

export function TourEngineProvider({ children }: { children: ReactNode }) {
  return (
    <TourGuideProvider>
      {children}
      <TourGuideOverlay />
    </TourGuideProvider>
  );
}

export function useTourEngine() {
  const { startTour, endTour, pauseTour, resumeTour } = useTourGuide();
  const reduced = useReducedMotion();

  const run = useCallback(
    (definitions: readonly TourStepDefinition[], onEnd: (completed: boolean) => void) => {
      const steps = definitions.map((definition, index) =>
        toTourStep(definition, index, definitions.length),
      );
      const config: TourGuideConfig = {
        motion: reduced ? "none" : "fade",
        animationDuration: reduced ? 0 : 220,
        spotlightStyles: { overlayOpacity: 0.72, overlayColor: "#000000" },
        enableAccessibility: true,
        onTourEnd: (completed) => {
          scrollDashboardToTop();
          onEnd(completed);
        },
      };
      startTour(steps, config);
    },
    [startTour, reduced],
  );

  const stop = useCallback(() => {
    scrollDashboardToTop();
    endTour();
  }, [endTour]);

  return { run, stop, pause: pauseTour, resume: resumeTour };
}
