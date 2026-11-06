import {
  fieldIconClass,
  fieldInputClass,
  fieldSurfaceClass,
} from "@/shared/components/ui/field-classes";
import { Icon } from "@/shared/components/ui/Icon";
import { ScopedTextInput } from "@/shared/components/ui/scoped-text-input";
import { useFocusState } from "@/shared/components/ui/use-focus-state";
import { messages } from "@/shared/i18n";
import { IconEye, IconEyeOff, type Icon as TablerIconType } from "@tabler/icons-react-native";
import { useRef, useState } from "react";
import { Pressable, TextInput } from "react-native";

type TextInputRef = React.ComponentRef<typeof TextInput>;

type IconInputProps = React.ComponentProps<typeof TextInput> & {
  icon: TablerIconType;
  invalid?: boolean;
  className?: string;
  secureToggle?: boolean;
};

function IconInput({
  icon,
  invalid = false,
  className,
  ref,
  onFocus,
  onBlur,
  editable,
  secureToggle = false,
  secureTextEntry,
  ...props
}: IconInputProps) {
  const innerRef = useRef<TextInputRef | null>(null);
  const focus = useFocusState(onFocus, onBlur);
  const [hidden, setHidden] = useState(true);
  const iconClass = fieldIconClass(invalid, focus.focused);
  const surfaceClass = fieldSurfaceClass(invalid, focus.focused);

  const setRefs = (node: TextInputRef | null) => {
    innerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as React.RefObject<TextInputRef | null>).current = node;
  };

  return (
    <Pressable
      accessible={false}
      onPress={() => innerRef.current?.focus()}
      className={`h-12 w-full flex-row items-center gap-3 rounded-lg border px-4 ${surfaceClass} ${editable === false ? "opacity-50" : ""} ${className ?? ""}`}
    >
      <Icon as={icon} size={20} className={iconClass} />
      <ScopedTextInput
        ref={setRefs}
        editable={editable}
        secureTextEntry={secureToggle ? hidden : secureTextEntry}
        aria-invalid={invalid}
        onFocus={focus.onFocus}
        onBlur={focus.onBlur}
        className={`h-full flex-1 py-0 font-figtree-regular text-base ${fieldInputClass(invalid, focus.focused)}`}
        {...props}
      />
      {secureToggle ? (
        <Pressable
          role="button"
          accessibilityLabel={
            hidden ? messages.Common.show_password : messages.Common.hide_password
          }
          accessibilityState={{ checked: !hidden }}
          disabled={editable === false}
          onPress={() => setHidden((v) => !v)}
          className="-mr-3 size-11 items-center justify-center rounded-md active:bg-foreground/10"
        >
          <Icon as={hidden ? IconEye : IconEyeOff} size={20} className={iconClass} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

export { IconInput };
export type { IconInputProps };
