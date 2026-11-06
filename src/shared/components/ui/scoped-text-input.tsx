import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { cssInterop } from "nativewind";
import { createContext, use } from "react";
import { TextInput } from "react-native";

cssInterop(BottomSheetTextInput, {
  className: { target: "style", nativeStyleToProp: { textAlign: true } },
});

const SheetScopeContext = createContext(false);

export function SheetScope({ children }: { children: React.ReactNode }) {
  return <SheetScopeContext value>{children}</SheetScopeContext>;
}

type ScopedTextInputProps = React.ComponentProps<typeof TextInput>;

export function ScopedTextInput(props: ScopedTextInputProps) {
  const inSheet = use(SheetScopeContext);
  if (inSheet) return <BottomSheetTextInput {...(props as React.ComponentProps<typeof BottomSheetTextInput>)} />;
  return <TextInput {...props} />;
}

export { BottomSheetTextInput as SheetTextInput };
