import { fieldInputClass, fieldSurfaceClass } from "@/shared/components/ui/field-classes";
import { useFocusState } from "@/shared/components/ui/use-focus-state";
import { TextInput } from "react-native";

type InputProps = React.ComponentProps<typeof TextInput> & {
  invalid?: boolean;
};

function Input({ className, invalid, onFocus, onBlur, ...props }: InputProps) {
  const focus = useFocusState(onFocus, onBlur);
  const surfaceClass = fieldSurfaceClass(invalid, focus.focused);
  return (
    <TextInput
      className={`h-11 w-full min-w-0 rounded-md border px-3 py-2 font-figtree-regular text-base leading-5 ${fieldInputClass(invalid, focus.focused)} ${surfaceClass} ${props.editable === false ? "opacity-50" : ""} ${className ?? ""}`}
      aria-invalid={invalid}
      onFocus={focus.onFocus}
      onBlur={focus.onBlur}
      {...props}
    />
  );
}

export { Input };
export type { InputProps };
