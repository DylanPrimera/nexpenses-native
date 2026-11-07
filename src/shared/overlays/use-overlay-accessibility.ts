import { useCallback, useEffect, useRef } from "react";
import { focusAccessibilityTarget, type AccessibilityFocusRef } from "./accessibility-focus";
import { isTopOverlay, useOverlayStore } from "./overlay-registry";

export function useOverlayAccessibility(
  id: string,
  initialFocusRef: AccessibilityFocusRef,
  returnFocusRef?: AccessibilityFocusRef,
) {
  const frame = useRef<number | undefined>(undefined);
  const focused = useRef(false);
  const parentId = useRef<string | undefined>(undefined);
  const cancel = useCallback(() => {
    if (frame.current !== undefined) cancelAnimationFrame(frame.current);
  }, []);
  useEffect(() => cancel, [cancel]);
  const focusOnOpen = useCallback(() => {
    if (focused.current) return;
    const { layerIds } = useOverlayStore.getState();
    const index = layerIds.indexOf(id);
    parentId.current = index > 0 ? layerIds[index - 1] : undefined;
    cancel();
    frame.current = requestAnimationFrame(() => {
      if (!isTopOverlay(id) || !initialFocusRef.current) return;
      focused.current = true;
      focusAccessibilityTarget(initialFocusRef);
    });
  }, [cancel, id, initialFocusRef]);
  const restoreFocus = useCallback(() => {
    cancel();
    focused.current = false;
    frame.current = requestAnimationFrame(() => {
      const { layerIds } = useOverlayStore.getState();
      const top = layerIds.at(-1);
      if (top !== undefined && top !== parentId.current) return;
      focusAccessibilityTarget(top === undefined && parentId.current ? undefined : returnFocusRef);
    });
  }, [cancel, returnFocusRef]);
  return { focusOnOpen, restoreFocus };
}
