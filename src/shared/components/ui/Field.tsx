import { Label } from "@/shared/components/ui/label";
import { Text } from "@/shared/components/ui/text";
import {
  uniqueErrorMessages,
  type FieldErrorInput,
} from "@/shared/utils/field-errors";
import { createContext, useContext } from "react";
import { View, type ViewProps } from "react-native";

type FieldState = { invalid: boolean; disabled: boolean };

const FieldContext = createContext<FieldState>({ invalid: false, disabled: false });

type FieldProps = ViewProps & {
  className?: string;
  invalid?: boolean;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
};

function Field({
  className,
  invalid = false,
  disabled = false,
  orientation = "vertical",
  ...props
}: FieldProps) {
  return (
    <FieldContext.Provider value={{ invalid, disabled }}>
      <View
        role="group"
        className={`w-full ${orientation === "horizontal" ? "flex-row items-center" : "flex-col"} ${disabled ? "opacity-50" : ""} ${className ?? "gap-3"}`}
        {...props}
      />
    </FieldContext.Provider>
  );
}

function FieldGroup({ className, ...props }: ViewProps & { className?: string }) {
  return <View className={`w-full flex-col ${className ?? "gap-7"}`} {...props} />;
}

function FieldContent({ className, ...props }: ViewProps & { className?: string }) {
  return <View className={`flex-1 flex-col ${className ?? "gap-1"}`} {...props} />;
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  const { invalid, disabled } = useContext(FieldContext);
  return (
    <Label
      disabled={disabled}
      className={invalid ? "font-figtree-medium text-sm text-destructive" : className}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={`text-left text-sm leading-normal text-muted-foreground ${className ?? ""}`}
      {...props}
    />
  );
}

type FieldErrorProps = React.ComponentProps<typeof Text> & {
  errors?: FieldErrorInput;
};

function FieldError({ className, children, errors, ...props }: FieldErrorProps) {
  const messages = children ? [] : uniqueErrorMessages(errors);
  if (!children && messages.length === 0) return null;

  const content =
    children ??
    (messages.length === 1 ? messages[0] : messages.map((m) => `• ${m}`).join("\n"));

  return (
    <Text
      role="alert"
      aria-live="polite"
      className={`text-sm text-destructive ${className ?? ""}`}
      {...props}
    >
      {content}
    </Text>
  );
}

export { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel };
