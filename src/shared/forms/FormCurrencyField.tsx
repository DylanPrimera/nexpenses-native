import { Field, FieldError } from "@/shared/components/ui/Field";
import { useField, useFormikContext } from "formik";
import { CurrencyInput } from "./CurrencyInput";
import { visibleFieldError } from "./field-meta";
import { FormFieldLabel } from "./FormFieldLabel";

type CurrencyInputProps = React.ComponentProps<typeof CurrencyInput>;

export type FormCurrencyFieldProps = Omit<
  CurrencyInputProps,
  "value" | "onChange" | "hasError"
> & {
  name: string;
  label: string;
  required?: boolean;
  containerClassName?: string;
};

export function FormCurrencyField({
  name,
  label,
  required = true,
  containerClassName,
  onBlur,
  ...inputProps
}: FormCurrencyFieldProps) {
  const [field, meta] = useField<number>(name);
  const { setFieldValue, setFieldTouched, submitCount } = useFormikContext();
  const error = visibleFieldError(meta, { empty: !field.value, submitted: submitCount > 0 });

  return (
    <Field invalid={!!error} className={containerClassName ?? "gap-2"}>
      <FormFieldLabel label={label} required={required} />
      <CurrencyInput
        value={field.value ?? 0}
        onChange={(value) => void setFieldValue(name, value)}
        onBlur={(e) => {
          void setFieldTouched(name, true);
          onBlur?.(e);
        }}
        hasError={!!error}
        accessibilityLabel={label}
        {...inputProps}
      />
      <FieldError errors={error} />
    </Field>
  );
}
