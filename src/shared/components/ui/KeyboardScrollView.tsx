import { cssInterop } from "nativewind";
import type { ComponentProps } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

cssInterop(KeyboardAwareScrollView, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
});

type KeyboardScrollViewProps = ComponentProps<typeof KeyboardAwareScrollView>;

const FOCUSED_INPUT_GAP = 24;

export function KeyboardScrollView({
  bottomOffset = FOCUSED_INPUT_GAP,
  keyboardShouldPersistTaps = "handled",
  ...props
}: KeyboardScrollViewProps) {
  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      bottomOffset={bottomOffset}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      {...props}
    />
  );
}

export type { KeyboardScrollViewProps };
