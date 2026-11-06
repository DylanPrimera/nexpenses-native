import { BlurTargetView } from "expo-blur";
import { createContext, useContext, useRef, type ComponentRef, type RefObject } from "react";
import { StyleSheet, type View } from "react-native";

type BlurTargetRef = RefObject<ComponentRef<typeof View> | null>;

const BlurTargetContext = createContext<BlurTargetRef | null>(null);

export function OverlayBlurProvider({ children }: { children: React.ReactNode }) {
  const targetRef = useRef<ComponentRef<typeof View>>(null);
  return <BlurTargetContext.Provider value={targetRef}>{children}</BlurTargetContext.Provider>;
}

export function OverlayBlurTarget({ children }: { children: React.ReactNode }) {
  const targetRef = useContext(BlurTargetContext);
  return (
    <BlurTargetView ref={targetRef ?? undefined} style={styles.fill}>
      {children}
    </BlurTargetView>
  );
}

export function useOverlayBlurTarget() {
  return useContext(BlurTargetContext);
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
