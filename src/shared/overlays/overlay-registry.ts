import { create } from "zustand";

type OverlayState = {
  openCount: number;
};

export const useOverlayStore = create<OverlayState>()(() => ({ openCount: 0 }));

export function acquireOverlay() {
  useOverlayStore.setState((state) => ({ openCount: state.openCount + 1 }));
  let released = false;
  return () => {
    if (released) return;
    released = true;
    useOverlayStore.setState((state) => ({ openCount: Math.max(0, state.openCount - 1) }));
  };
}
