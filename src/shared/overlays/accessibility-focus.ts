import { AccessibilityInfo, findNodeHandle } from "react-native";
import type { RefObject } from "react";

type Target = Parameters<typeof findNodeHandle>[0];
export type AccessibilityFocusRef = RefObject<Target>;
let fallback: Target = null;

export function setAccessibilityFallback(target: Target) {
  fallback = target;
  return () => {
    if (fallback === target) fallback = null;
  };
}

export function focusAccessibilityTarget(ref?: AccessibilityFocusRef) {
  const node = ref?.current ?? fallback;
  if (!node) return;
  const handle = findNodeHandle(node);
  if (handle != null) AccessibilityInfo.setAccessibilityFocus(handle);
}
