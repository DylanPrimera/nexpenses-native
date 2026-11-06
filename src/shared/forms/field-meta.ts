export function visibleFieldError(meta: { touched?: boolean; error?: string }): string | undefined {
  return meta.touched && meta.error ? meta.error : undefined;
}
