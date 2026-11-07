import type { ComponentRef, RefObject } from "react";
import type { View } from "react-native";
import { create } from "zustand";

export type TourViewInstance = ComponentRef<typeof View>;
export type TourTargetRef = RefObject<TourViewInstance | null>;
export type TourScrollerRef = RefObject<unknown>;

export const tourScrollOffset = { current: 0 };

type TourTargetState = {
  targets: Readonly<Record<string, TourTargetRef>>;
  scroller: TourScrollerRef | null;
  register: (id: string, ref: TourTargetRef) => void;
  unregister: (id: string, ref: TourTargetRef) => void;
  setScroller: (ref: TourScrollerRef | null) => void;
};

export const useTourTargetStore = create<TourTargetState>()((set) => ({
  targets: {},
  scroller: null,
  register: (id, ref) => set((state) => ({ targets: { ...state.targets, [id]: ref } })),
  unregister: (id, ref) =>
    set((state) => {
      if (state.targets[id] !== ref) return state;
      const { [id]: _removed, ...rest } = state.targets;
      return { targets: rest };
    }),
  setScroller: (ref) => {
    tourScrollOffset.current = 0;
    set({ scroller: ref });
  },
}));
