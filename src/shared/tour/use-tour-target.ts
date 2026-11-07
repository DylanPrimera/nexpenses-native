import { useCallback, useEffect, useRef } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import type { KeyboardAwareScrollViewRef } from "react-native-keyboard-controller";
import { tourScrollOffset, useTourTargetStore, type TourViewInstance } from "./target-registry";

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
  const ref = useRef<KeyboardAwareScrollViewRef>(null);
  const { setScroller } = useTourTargetStore.getState();

  useEffect(() => {
    if (!enabled) return;
    setScroller(ref);
    return () => {
      if (useTourTargetStore.getState().scroller === ref) setScroller(null);
    };
  }, [enabled, setScroller]);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    tourScrollOffset.current = event.nativeEvent.contentOffset.y;
  }, []);

  return { ref, onScroll };
}
