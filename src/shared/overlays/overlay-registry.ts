import { create } from "zustand";

type OverlayState = { openCount: number; layerIds: string[] };
export const useOverlayStore = create<OverlayState>()(() => ({ openCount: 0, layerIds: [] }));
let sequence = 0;

export function acquireOverlay(id = `overlay-${++sequence}`) {
  const token = id;
  useOverlayStore.setState((state) => {
    const layerIds = [...state.layerIds, token];
    return { layerIds, openCount: layerIds.length };
  });
  let released = false;
  return () => {
    if (released) return;
    released = true;
    useOverlayStore.setState((state) => {
      const layerIds = state.layerIds.filter((layer) => layer !== token);
      return { layerIds, openCount: layerIds.length };
    });
  };
}

export function isTopOverlay(id: string) {
  const { layerIds } = useOverlayStore.getState();
  return layerIds.at(-1) === id;
}
