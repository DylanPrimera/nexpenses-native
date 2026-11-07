import { Field, FieldError } from "@/shared/components/ui/Field";
import { IconInput } from "@/shared/components/ui/IconInput";
import { visibleFieldError } from "@/shared/forms/field-meta";
import { DatePickerField } from "@/shared/forms/DatePickerField";
import { FormFieldLabel } from "@/shared/forms/FormFieldLabel";
import type { Icon as TablerIconType } from "@tabler/icons-react-native";
import { useField, useFormikContext } from "formik";

type DebtDateFieldProps = {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
};

export function DebtDateField({ name, label, placeholder, required = true }: DebtDateFieldProps) {
  const [field, meta] = useField<string>(name);
  const { setFieldValue, setFieldTouched, submitCount } = useFormikContext();
  const error = visibleFieldError(meta, { empty: !field.value, submitted: submitCount > 0 });

  return (
    <Field invalid={!!error} className="gap-2">
      <FormFieldLabel label={label} required={required} />
      <DatePickerField
        value={field.value ?? ""}
        placeholder={placeholder}
        hasError={!!error}
        onChange={(value) => {
          void setFieldValue(name, value);
          void setFieldTouched(name, true, false);
        }}
      />
      <FieldError errors={error} />
    </Field>
  );
}

type DebtIntegerFieldProps = {
  name: string;
  label: string;
  icon: TablerIconType;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
};

export function DebtIntegerField({
  name,
  label,
  icon,
  required = true,
  maxLength = 3,
  placeholder,
}: DebtIntegerFieldProps) {
  const [field, meta] = useField<string>(name);
  const { setFieldValue, setFieldTouched, submitCount } = useFormikContext();
  const error = visibleFieldError(meta, { empty: !field.value, submitted: submitCount > 0 });

  return (
    <Field invalid={!!error} className="gap-2">
      <FormFieldLabel label={label} required={required} />
      <IconInput
        icon={icon}
        value={field.value ?? ""}
        onChangeText={(text) =>
          void setFieldValue(name, text.replace(/\D/g, "").slice(0, maxLength))
        }
        onBlur={() => void setFieldTouched(name, true)}
        keyboardType="number-pad"
        maxLength={maxLength}
        placeholder={placeholder}
        invalid={!!error}
        accessibilityLabel={label}
      />
      <FieldError errors={error} />
    </Field>
  );
}
