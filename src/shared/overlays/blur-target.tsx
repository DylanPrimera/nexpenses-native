import { useOverlayStore } from "./overlay-registry";
import { BlurTargetView } from "expo-blur";
import { createContext, useContext, useRef, type ComponentRef, type RefObject } from "react";
import { StyleSheet, View } from "react-native";

type BlurTargetRef = RefObject<ComponentRef<typeof View> | null>;

const BlurTargetContext = createContext<BlurTargetRef | null>(null);

export function OverlayBlurProvider({ children }: { children: React.ReactNode }) {
  const targetRef = useRef<ComponentRef<typeof View>>(null);
  return <BlurTargetContext.Provider value={targetRef}>{children}</BlurTargetContext.Provider>;
}

export function OverlayBlurTarget({ children }: { children: React.ReactNode }) {
  const targetRef = useContext(BlurTargetContext);
  const { openCount } = useOverlayStore();
  return (
    <BlurTargetView ref={targetRef ?? undefined} style={styles.fill}>
      <View
        style={styles.fill}
        accessibilityElementsHidden={openCount > 0}
        importantForAccessibility={openCount > 0 ? "no-hide-descendants" : "auto"}
      >
        {children}
      </View>
    </BlurTargetView>
  );
}

export function useOverlayBlurTarget() {
  return useContext(BlurTargetContext);
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
