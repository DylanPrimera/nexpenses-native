import {
  buttonTextVariants,
  buttonVariants,
  type ButtonSize,
  type ButtonStyleProps,
  type ButtonVariant,
} from "@/shared/components/ui/button-classes";
import { TextClassContext } from "@/shared/components/ui/text";
import { Pressable } from "react-native";

type ButtonProps = React.ComponentProps<typeof Pressable> & ButtonStyleProps;

const COMPACT_SIZES = new Set<ButtonSize>(["xs", "sm", "icon-xs", "icon-sm"]);
const COMPACT_HIT_SLOP = { top: 6, bottom: 6, left: 6, right: 6 };

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={`${buttonVariants({ variant, size })} ${props.disabled ? "opacity-50" : ""} ${className ?? ""}`}
        role="button"
        hitSlop={size && COMPACT_SIZES.has(size) ? COMPACT_HIT_SLOP : undefined}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps, ButtonSize, ButtonVariant };
