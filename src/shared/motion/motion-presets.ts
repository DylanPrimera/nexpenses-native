import { Easing, type WithTimingConfig } from "react-native-reanimated";
import {
  DURATION_FAST_MS,
  DURATION_UI_MS,
  EASE_OUT_BEZIER,
  motionDuration,
} from "./motion-tokens";

export { DURATION_FAST_MS, DURATION_UI_MS, EASE_OUT_BEZIER, motionDuration };

export const EASE_OUT = Easing.bezier(...EASE_OUT_BEZIER);

export function motionTiming(reduced: boolean | null | undefined): WithTimingConfig {
  return { duration: motionDuration(reduced, DURATION_UI_MS), easing: EASE_OUT };
}

export function fadeTiming(reduced: boolean | null | undefined): WithTimingConfig {
  return { duration: motionDuration(reduced, DURATION_FAST_MS), easing: EASE_OUT };
}

export const panelTiming = motionTiming;
