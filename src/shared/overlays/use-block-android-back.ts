import { useEffect } from "react";
import { BackHandler } from "react-native";

export function useBlockAndroidBack(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => subscription.remove();
  }, [active]);
}
