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

const COMPACT_HIT_SLOP: Partial<Record<ButtonSize, number>> = {
  xs: 8,
  sm: 6,
  icon: 2,
  "icon-xs": 8,
  "icon-sm": 6,
};

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={`${buttonVariants({ variant, size })} ${props.disabled ? "opacity-50" : ""} ${className ?? ""}`}
        role="button"
        hitSlop={size ? COMPACT_HIT_SLOP[size] : undefined}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps, ButtonSize, ButtonVariant };
