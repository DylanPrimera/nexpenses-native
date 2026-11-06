import { cn } from "@/core/utils/cn";
import type {
  Icon as TablerIconType,
  IconProps as TablerIconProps,
} from "@tabler/icons-react-native";
import { cssInterop } from "nativewind";
import * as React from "react";

type IconProps = TablerIconProps & {
  as: TablerIconType;
  className?: string;
};

function IconImpl({ as: IconComponent, ...props }: IconProps) {
  return <IconComponent {...props} />;
}

cssInterop(IconImpl, {
  className: {
    target: "style",
    nativeStyleToProp: {
      height: "size",
      width: "size",
      color: true,
    },
  },
});

/** Tabler icon wrapper with NativeWind `className` (no Lucide). */
export function Icon({
  as: IconComponent,
  className,
  size = 24,
  ...props
}: IconProps) {
  return (
    <IconImpl
      as={IconComponent}
      className={cn("text-foreground", className)}
      size={size}
      {...props}
    />
  );
}
