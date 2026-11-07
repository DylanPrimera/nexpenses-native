import { useRef, useState } from "react";
import {
  fieldIconClass,
  fieldPlaceholderClass,
  fieldSurfaceClass,
  fieldTextClass,
} from "@/shared/components/ui/field-classes";
import { CalendarSheet } from "@/shared/components/ui/Calendar";
import { formatPickedDate } from "@/shared/components/ui/calendar-grid";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { AppSheet } from "@/shared/overlays/AppSheet";
import { IconCalendar } from "@tabler/icons-react-native";
import { Pressable } from "react-native";

type DatePickerFieldProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
};

export function DatePickerField({
  value,
  onChange,
  disabled = false,
  hasError = false,
  placeholder = messages.Common.select_date,
  minDate,
  maxDate,
}: DatePickerFieldProps) {
  const triggerRef = useRef<React.ComponentRef<typeof Pressable>>(null);
  const [open, setOpen] = useState(false);
  const hasValue = value.trim().length > 0;
  const surfaceClass = fieldSurfaceClass(hasError, open);
  const valueClass = hasValue ? fieldTextClass(hasError) : fieldPlaceholderClass(hasError, open);

  return (
    <>
      <Pressable
        ref={triggerRef}
        role="button"
        accessibilityState={{ disabled, expanded: open }}
        aria-invalid={hasError}
        disabled={disabled}
        onPress={() => setOpen(true)}
        className={`min-h-12 w-full flex-row items-center gap-3 rounded-lg border px-4 py-3 ${surfaceClass} ${disabled ? "opacity-50" : ""}`}
      >
        <Icon as={IconCalendar} size={20} className={fieldIconClass(hasError, open)} />
        <Text className={`flex-1 ${valueClass}`}>
          {hasValue ? formatPickedDate(value) : placeholder}
        </Text>
      </Pressable>
      <AppSheet
        returnFocusRef={triggerRef}
        isOpen={open}
        onChange={setOpen}
        fullHeight
        renderScrollable={({ paddingBottom }) => (
          <CalendarSheet
            paddingBottom={paddingBottom}
            value={hasValue ? value : undefined}
            minDate={minDate}
            maxDate={maxDate}
            onChange={(next) => {
              onChange(next);
              setOpen(false);
            }}
          />
        )}
      />
    </>
  );
}

export type { DatePickerFieldProps };
