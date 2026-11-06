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
  const borderClass = invalid
    ? "border-destructive"
    : focus.focused
      ? "border-ring"
      : "border-foreground/25";
  return (
    <TextInput
      className={`min-h-24 w-full flex-row rounded-md border bg-field px-3 py-2.5 font-figtree-regular text-base text-foreground ${borderClass} ${props.editable === false ? "opacity-50" : ""} ${className ?? ""}`}
      placeholderClassName={placeholderClassName ?? "text-muted-foreground"}
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
