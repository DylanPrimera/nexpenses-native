import { TextClassContext } from "@/shared/components/ui/text";
import type {
  IconProps as TablerIconProps,
  Icon as TablerIconType,
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

export function Icon({ as: IconComponent, className, size = 24, ...props }: IconProps) {
  const textClass = React.useContext(TextClassContext);
  return (
    <IconImpl
      as={IconComponent}
      className={[textClass, className].filter(Boolean).join(" ")}
      size={size}
      {...props}
    />
  );
}
