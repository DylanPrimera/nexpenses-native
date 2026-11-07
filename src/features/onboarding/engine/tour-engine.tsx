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
import { useCallback, useEffect, type ReactNode } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { focusAccessibilityTarget } from "@/shared/overlays/accessibility-focus";
import { useReducedMotion } from "react-native-reanimated";
import type { TourStepDefinition } from "../interfaces";
import { TourTooltip } from "./TourTooltip";

const SPOTLIGHT_PADDING = 6;
const SCROLL_OFFSET = 24;
const SCROLLABLE_TARGETS = new Set<string>([TOUR_TARGETS.budget, TOUR_TARGETS.recent]);

function toTourStep(
  definition: TourStepDefinition,
  index: number,
  total: number,
  reduced: boolean,
): TourStep {
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
          animated: !reduced,
          getCurrentScrollOffset: () => tourScrollOffset.current,
        }
      : undefined,
    accessibilityLabel: `${tx(messages.Tour.progress, { current: index + 1, total })}. ${definition.title}. ${definition.description}`,
    renderTooltip: (props) => <TourTooltip {...props} icon={definition.icon} />,
  };
}

function scrollDashboardToTop(reduced: boolean) {
  const { scroller: scrollRef } = useTourTargetStore.getState();
  const scroller = scrollRef?.current as
    { scrollTo?: (options: { y: number; animated: boolean }) => void } | null | undefined;
  scroller?.scrollTo?.({ y: 0, animated: !reduced });
}

function TourEngineHost({ children }: { children: ReactNode }) {
  const { isActive, isPaused, skipTour } = useTourGuide();
  const visible = isActive && !isPaused;

  useEffect(() => {
    if (!visible) return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      skipTour();
      return true;
    });
    return () => {
      subscription.remove();
      requestAnimationFrame(() => focusAccessibilityTarget());
    };
  }, [skipTour, visible]);

  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <View
        style={{ flex: 1 }}
        pointerEvents={visible ? "none" : "auto"}
        accessibilityElementsHidden={visible}
        importantForAccessibility={visible ? "no-hide-descendants" : "auto"}
      >
        {children}
      </View>
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents="box-none"
        accessibilityViewIsModal={visible}
      >
        <TourGuideOverlay />
      </View>
    </View>
  );
}

export function TourEngineProvider({ children }: { children: ReactNode }) {
  return (
    <TourGuideProvider>
      <TourEngineHost>{children}</TourEngineHost>
    </TourGuideProvider>
  );
}

export function useTourEngine() {
  const { startTour, endTour, pauseTour, resumeTour } = useTourGuide();
  const reduced = useReducedMotion();
  const insets = useSafeAreaInsets();

  const run = useCallback(
    (definitions: readonly TourStepDefinition[], onEnd: (completed: boolean) => void) => {
      const steps = definitions.map((definition, index) =>
        toTourStep(definition, index, definitions.length, reduced),
      );
      const config: TourGuideConfig = {
        overlayMode: "inline",
        insets,
        motion: reduced ? "none" : "fade",
        animationDuration: reduced ? 0 : 220,
        spotlightStyles: { overlayOpacity: 0.72, overlayColor: "#000000" },
        enableAccessibility: true,
        onTourEnd: (completed) => {
          scrollDashboardToTop(reduced);
          onEnd(completed);
        },
      };
      startTour(steps, config);
    },
    [startTour, reduced, insets],
  );

  const stop = useCallback(() => {
    scrollDashboardToTop(reduced);
    endTour();
  }, [endTour, reduced]);

  return { run, stop, pause: pauseTour, resume: resumeTour };
}
