import { useWindowDimensions, TextInput } from "react-native";
import { controlMinHeight } from "@/shared/utils/control-size";
import { fieldInputClass, fieldSurfaceClass } from "@/shared/components/ui/field-classes";
import { ScopedTextInput } from "@/shared/components/ui/scoped-text-input";
import { useFocusState } from "@/shared/components/ui/use-focus-state";

type InputProps = React.ComponentProps<typeof TextInput> & {
  invalid?: boolean;
};

function Input({ className, invalid, onFocus, onBlur, style, ...props }: InputProps) {
  const { fontScale } = useWindowDimensions();
  const focus = useFocusState(onFocus, onBlur);
  const surfaceClass = fieldSurfaceClass(invalid, focus.focused);
  return (
    <ScopedTextInput
      className={`${fontScale > 1 ? "h-auto" : "h-11"} w-full min-w-0 rounded-md border px-3 py-2 font-figtree-regular text-base leading-5 ${fieldInputClass(invalid, focus.focused)} ${surfaceClass} ${props.editable === false ? "opacity-50" : ""} ${className ?? ""}`}
      style={[{ minHeight: controlMinHeight(fontScale) }, style]}
      aria-invalid={invalid}
      onFocus={focus.onFocus}
      onBlur={focus.onBlur}
      {...props}
    />
  );
}

export { Input };
export type { InputProps };
