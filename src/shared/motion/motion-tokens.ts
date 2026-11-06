export const EASE_OUT_BEZIER = [0.22, 1, 0.36, 1] as const;

export const DURATION_FAST_MS = 150;
export const DURATION_UI_MS = 200;

export function motionDuration(reduced: boolean | null | undefined, durationMs = DURATION_UI_MS) {
  return reduced ? 0 : durationMs;
}
