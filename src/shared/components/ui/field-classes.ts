export function fieldSurfaceClass(invalid: boolean | undefined, active: boolean) {
  if (invalid) return "border-destructive bg-destructive/10";
  return active ? "border-ring bg-field" : "border-foreground/25 bg-field";
}

export function fieldIconClass(invalid: boolean | undefined, active: boolean) {
  if (invalid) return "text-destructive";
  return active ? "text-primary" : "text-muted-foreground";
}

export function fieldTextClass(invalid: boolean | undefined) {
  return invalid ? "text-destructive" : "text-foreground";
}

export function fieldPlaceholderClass(invalid: boolean | undefined, active: boolean) {
  return fieldIconClass(invalid, active);
}

export function fieldInputClass(invalid: boolean | undefined, active: boolean) {
  if (invalid) return "text-destructive placeholder:text-destructive";
  return active
    ? "text-foreground placeholder:text-primary"
    : "text-foreground placeholder:text-muted-foreground";
}
