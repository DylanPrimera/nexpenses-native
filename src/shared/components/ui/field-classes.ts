export function fieldSurfaceClass(invalid: boolean | undefined, active: boolean) {
  if (invalid) return "border-destructive bg-destructive/10";
  return active ? "border-ring bg-muted/70" : "border-control-border bg-muted/70";
}

export function fieldIconClass(invalid: boolean | undefined, active: boolean) {
  if (invalid) return "text-destructive";
  return active ? "text-primary-action" : "text-muted-foreground";
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
    ? "text-foreground placeholder:text-primary-action"
    : "text-foreground placeholder:text-muted-foreground";
}
