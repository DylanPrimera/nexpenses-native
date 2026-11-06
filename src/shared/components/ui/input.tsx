import { useFocusState } from "@/shared/components/ui/use-focus-state";
import { TextInput } from "react-native";

type InputProps = React.ComponentProps<typeof TextInput> & {
    invalid?: boolean;
  };

function Input({ className, invalid, onFocus, onBlur, ...props }: InputProps) {
  const focus = useFocusState(onFocus, onBlur);
  const borderClass = invalid
    ? "border-destructive"
    : focus.focused
      ? "border-ring"
      : "border-foreground/25";
  return (
    <TextInput
      className={`h-11 w-full min-w-0 rounded-md border bg-field px-3 py-2 font-figtree-regular text-base leading-5 text-foreground placeholder:text-muted-foreground ${borderClass} ${props.editable === false ? "opacity-50" : ""} ${className ?? ""}`}
      aria-invalid={invalid}
      onFocus={focus.onFocus}
      onBlur={focus.onBlur}
      {...props}
    />
  );
}

export { Input };
export type { InputProps };
