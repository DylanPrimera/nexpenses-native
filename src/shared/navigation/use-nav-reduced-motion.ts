import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";
import { useReducedMotion } from "react-native-reanimated";

export function useNavReducedMotion() {
  const initial = useReducedMotion();
  const [reduced, setReduced] = useState(initial);

  useEffect(() => {
    let active = true;
    let receivedEvent = false;
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", (value) => {
      receivedEvent = true;
      if (active) setReduced(value);
    });
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (active && !receivedEvent) setReduced(value);
    }).catch(() => undefined);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  return reduced;
}
