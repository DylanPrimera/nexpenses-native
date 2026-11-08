import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef } from "react";
import { Gesture } from "react-native-gesture-handler";
import {
  cancelAnimation,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { motionTiming } from "@/shared/motion/motion-presets";
import { shiftMonth } from "./calendar-grid";
import { calendarTransition, initialCalendarTransition } from "./calendar-transition";

type Props = { month: string; width: number; onMonthChange: (month: string) => void };

export function useCalendarPager({ month, width, onMonthChange }: Props) {
  const [state, dispatch] = useReducer(calendarTransition, month, initialCalendarTransition);
  const reduced = useReducedMotion();
  const scrollOffset = useSharedValue(0);
  const busy = useSharedValue(false);
  const committed = useSharedValue(false);
  const epoch = useSharedValue(0);
  const timing = useMemo(() => motionTiming(reduced), [reduced]);
  const observedMonth = useRef(month);
  const publishedRevision = useRef(-1);
  const currentOffset = state.position * width;

  const navigate = useCallback(
    (target: string, publish: boolean) => {
      dispatch({ type: reduced ? "jump" : "navigate", target, publish });
    },
    [reduced],
  );
  const goToMonth = useCallback(
    (step: number) => {
      navigate(shiftMonth(state.month, step), true);
    },
    [navigate, state.month],
  );

  useLayoutEffect(() => {
    if (observedMonth.current === month) return;
    observedMonth.current = month;
    navigate(month, false);
  }, [month, navigate]);

  useLayoutEffect(() => {
    if (!state.publish || state.phase !== "idle" || publishedRevision.current === state.revision)
      return;
    publishedRevision.current = state.revision;
    onMonthChange(state.month);
  }, [state.publish, state.phase, state.revision, state.month, onMonthChange]);

  useLayoutEffect(() => {
    const currentEpoch = state.revision * 2 + (state.phase === "idle" ? 1 : 0);
    epoch.set(currentEpoch);
    cancelAnimation(scrollOffset);
    committed.set(false);
    if (state.phase === "idle") {
      scrollOffset.set(currentOffset);
      busy.set(false);
      return;
    }
    busy.set(true);
    if (reduced) {
      queueMicrotask(() =>
        dispatch({
          type: "jump",
          target: state.target,
          publish: state.publish,
          revision: state.revision,
        }),
      );
      return;
    }
    const revision = state.revision;
    scrollOffset.set(
      withTiming((state.position + state.direction) * width, timing, (finished) => {
        if (epoch.get() !== currentEpoch) return;
        if (!finished) {
          scrollOffset.set(currentOffset);
          busy.set(false);
          committed.set(false);
        }
        scheduleOnRN(dispatch, { type: finished ? "finish" : "cancel", revision });
      }),
    );
    return () => {
      epoch.set(-1);
      cancelAnimation(scrollOffset);
    };
  }, [
    state.phase,
    state.revision,
    state.direction,
    state.position,
    state.target,
    state.publish,
    width,
    currentOffset,
    reduced,
    timing,
    scrollOffset,
    busy,
    committed,
    epoch,
  ]);

  useEffect(
    () => () => {
      epoch.set(-1);
      cancelAnimation(scrollOffset);
      busy.set(false);
      committed.set(false);
    },
    [epoch, scrollOffset, busy, committed],
  );

  const gesture = Gesture.Pan()
    .activeOffsetX([-16, 16])
    .failOffsetY([-12, 12])
    .onUpdate((event) => {
      if (!busy.get() && !committed.get() && !reduced)
        scrollOffset.set(currentOffset - Math.max(-width, Math.min(width, event.translationX)));
    })
    .onEnd((event) => {
      if (busy.get() || committed.get()) return;
      const passedDistance = Math.abs(event.translationX) > width * 0.25;
      if (passedDistance || Math.abs(event.velocityX) > 500) {
        committed.set(true);
        const direction = passedDistance ? event.translationX : event.velocityX;
        scheduleOnRN(goToMonth, direction < 0 ? 1 : -1);
      } else {
        scrollOffset.set(withTiming(currentOffset, timing));
      }
    })
    .onFinalize(() => {
      if (!busy.get() && !committed.get() && scrollOffset.get() !== currentOffset)
        scrollOffset.set(withTiming(currentOffset, timing));
    });

  return {
    month: state.month,
    target: state.target,
    position: state.position,
    transitioning: state.phase !== "idle",
    scrollOffset,
    gesture,
    goToMonth,
  };
}
