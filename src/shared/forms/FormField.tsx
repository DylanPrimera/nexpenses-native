import { Field, FieldError } from "@/shared/components/ui/Field";
import { IconInput, type IconInputProps } from "@/shared/components/ui/IconInput";
import { useField, useFormikContext } from "formik";
import { visibleFieldError } from "./field-meta";
import { FormFieldLabel } from "./FormFieldLabel";

export type FormFieldProps = Omit<IconInputProps, "value" | "onChangeText" | "invalid"> & {
  name: string;
  label: string;
  required?: boolean;
  containerClassName?: string;
};

export function FormField({
  name,
  label,
  required = true,
  containerClassName,
  onBlur,
  ...inputProps
}: FormFieldProps) {
  const [field, meta] = useField<string>(name);
  const { handleChange, handleBlur } = useFormikContext();
  const error = visibleFieldError(meta);

  return (
    <Field invalid={!!error} className={containerClassName ?? "gap-2"}>
      <FormFieldLabel label={label} required={required} />
      <IconInput
        value={field.value ?? ""}
        onChangeText={handleChange(name)}
        onBlur={(e) => {
          handleBlur(name)(e);
          onBlur?.(e);
        }}
        invalid={!!error}
        accessibilityLabel={label}
        {...inputProps}
      />
      <FieldError errors={error} />
    </Field>
  );
}
