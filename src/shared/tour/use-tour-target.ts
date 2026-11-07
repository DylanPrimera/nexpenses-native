import { useCallback, useEffect, useRef } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { tourScrollOffset, useTourTargetStore, type TourViewInstance } from "./target-registry";
export type TourScrollHandle = { scrollTo: (options: { y: number; animated: boolean }) => void };

export function useTourTarget(id: string, enabled = true) {
  const ref = useRef<TourViewInstance>(null);
  const { register, unregister } = useTourTargetStore.getState();

  useEffect(() => {
    if (!enabled) return;
    register(id, ref);
    return () => unregister(id, ref);
  }, [id, enabled, register, unregister]);

  return ref;
}

export function useTourScroller(enabled = true) {
  const ref = useRef<TourScrollHandle>(null);
  const { setScroller } = useTourTargetStore.getState();

  useEffect(() => {
    if (!enabled) return;
    setScroller(ref);
    return () => {
      const { scroller } = useTourTargetStore.getState();
      if (scroller === ref) setScroller(null);
    };
  }, [enabled, setScroller]);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    tourScrollOffset.current = event.nativeEvent.contentOffset.y;
  }, []);

  return { ref, onScroll };
}
