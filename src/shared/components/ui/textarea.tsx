import {
  fieldPlaceholderClass,
  fieldSurfaceClass,
  fieldTextClass,
} from "@/shared/components/ui/field-classes";
import { ScopedTextInput } from "@/shared/components/ui/scoped-text-input";
import { useFocusState } from "@/shared/components/ui/use-focus-state";
import { TextInput } from "react-native";

type TextareaProps = React.ComponentProps<typeof TextInput> & {
  invalid?: boolean;
};

function Textarea({
  className,
  invalid,
  multiline = true,
  numberOfLines = 8,
  placeholderClassName,
  onFocus,
  onBlur,
  ...props
}: TextareaProps) {
  const focus = useFocusState(onFocus, onBlur);
  const surfaceClass = fieldSurfaceClass(invalid, focus.focused);
  return (
    <ScopedTextInput
      className={`min-h-24 w-full flex-row rounded-md border px-3 py-2.5 font-figtree-regular text-base ${fieldTextClass(invalid)} ${surfaceClass} ${props.editable === false ? "opacity-50" : ""} ${className ?? ""}`}
      placeholderClassName={placeholderClassName ?? fieldPlaceholderClass(invalid, focus.focused)}
      aria-invalid={invalid}
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      onFocus={focus.onFocus}
      onBlur={focus.onBlur}
      {...props}
    />
  );
}

export { Textarea };
export type { TextareaProps };
