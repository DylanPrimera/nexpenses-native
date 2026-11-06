type FieldMeta = { touched?: boolean; error?: string };
type FieldState = { empty?: boolean; submitted?: boolean };

export function visibleFieldError(meta: FieldMeta, { empty = false, submitted = false }: FieldState = {}) {
  if (!meta.error) return undefined;
  if (submitted) return meta.error;
  if (!meta.touched || empty) return undefined;
  return meta.error;
}
