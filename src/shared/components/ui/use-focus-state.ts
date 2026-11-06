import { useState } from "react";
import type { NativeSyntheticEvent, TargetedEvent } from "react-native";

type FocusHandler = ((e: NativeSyntheticEvent<TargetedEvent>) => void) | undefined;

export function useFocusState(onFocus: FocusHandler, onBlur: FocusHandler) {
  const [focused, setFocused] = useState(false);
  return {
    focused,
    onFocus: (e: NativeSyntheticEvent<TargetedEvent>) => {
      setFocused(true);
      onFocus?.(e);
    },
    onBlur: (e: NativeSyntheticEvent<TargetedEvent>) => {
      setFocused(false);
      onBlur?.(e);
    },
  };
}
