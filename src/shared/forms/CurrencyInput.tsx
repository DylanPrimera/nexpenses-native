import {
  fieldIconClass,
  fieldInputClass,
  fieldSurfaceClass,
} from "@/shared/components/ui/field-classes";
import { ScopedTextInput } from "@/shared/components/ui/scoped-text-input";
import { useEffect, useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";
import {
  blurredCurrencyText,
  focusedCurrencyText,
  parseCurrencyText,
  sanitizeCurrencyText,
} from "./currency-input-state";

type CurrencyInputProps = Omit<
  React.ComponentProps<typeof TextInput>,
  "value" | "onChange" | "onChangeText" | "keyboardType" | "inputMode"
> &
  React.RefAttributes<TextInput> & {
    value: number;
    onChange: (value: number) => void;
    hasError?: boolean;
    className?: string;
  };

export function CurrencyInput({
  value,
  onChange,
  hasError = false,
  className,
  onFocus,
  onBlur,
  editable,
  ...props
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(() => blurredCurrencyText(value));
  const [focused, setFocused] = useState(false);
  const lastEmitted = useRef<number>(value);

  useEffect(() => {
    if (value === lastEmitted.current) return;
    lastEmitted.current = value;
    setDisplayValue(focused ? focusedCurrencyText(value) : blurredCurrencyText(value));
  }, [value, focused]);

  return (
    <View className="relative w-full justify-center">
      <View
        pointerEvents="none"
        className="absolute bottom-0 left-3 top-0 z-10 justify-center"
        aria-hidden
      >
        <Text className={`font-figtree-semibold text-lg ${fieldIconClass(hasError, true)}`}>$</Text>
      </View>
      <ScopedTextInput
        value={displayValue}
        keyboardType="number-pad"
        inputMode="numeric"
        onChangeText={(text) => {
          const sanitized = sanitizeCurrencyText(text);
          setDisplayValue(sanitized);
          const parsed = parseCurrencyText(sanitized);
          lastEmitted.current = parsed;
          onChange(parsed);
        }}
        onFocus={(e) => {
          setFocused(true);
          setDisplayValue(focusedCurrencyText(value));
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          setDisplayValue(blurredCurrencyText(value));
          onBlur?.(e);
        }}
        editable={editable}
        aria-invalid={hasError}
        className={`h-12 w-full rounded-lg border py-2 pl-8 pr-4 font-figtree-regular text-base ${fieldInputClass(hasError, focused)} ${fieldSurfaceClass(hasError, focused)} ${editable === false ? "opacity-50" : ""} ${className ?? ""}`}
        {...props}
      />
    </View>
  );
}
