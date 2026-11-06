export type ButtonVariant = "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
export type ButtonSize = "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";

const variantClass: Record<ButtonVariant, string> = {
  default: "border-transparent bg-primary active:bg-primary/80",
  outline:
    "border-border bg-background shadow-sm shadow-black/5 active:bg-field dark:border-input dark:bg-input/30 dark:active:bg-input/50",
  secondary: "border-transparent bg-secondary active:bg-secondary-pressed",
  ghost: "border-transparent bg-transparent active:bg-foreground/10 dark:active:bg-muted/50",
  destructive:
    "border-transparent bg-destructive/10 active:bg-destructive/20 dark:bg-destructive/20 dark:active:bg-destructive/30",
  link: "border-transparent bg-transparent active:opacity-70",
};

const sizeClass: Record<ButtonSize, string> = {
  default: "h-11 gap-1.5 px-4",
  xs: "h-8 gap-1 px-2.5",
  sm: "h-9 gap-1 px-3",
  lg: "h-12 gap-2 px-5",
  icon: "size-11",
  "icon-xs": "size-8",
  "icon-sm": "size-9",
  "icon-lg": "size-12",
};

const textVariantClass: Record<ButtonVariant, string> = {
  default: "text-primary-foreground",
  outline: "text-foreground",
  secondary: "text-secondary-foreground",
  ghost: "text-foreground",
  destructive: "text-destructive",
  link: "text-primary underline",
};

const textSizeClass: Record<ButtonSize, string> = {
  default: "text-sm",
  xs: "text-xs",
  sm: "text-sm",
  lg: "text-base",
  icon: "text-sm",
  "icon-xs": "text-sm",
  "icon-sm": "text-sm",
  "icon-lg": "text-sm",
};

export type ButtonStyleProps = { variant?: ButtonVariant | null; size?: ButtonSize | null };

export function buttonVariants({ variant, size }: ButtonStyleProps = {}) {
  return `group shrink-0 flex-row items-center justify-center rounded-[0.5rem] border ${variantClass[variant ?? "default"]} ${sizeClass[size ?? "default"]}`;
}

export function buttonTextVariants({ variant, size }: ButtonStyleProps = {}) {
  return `font-figtree-medium ${textVariantClass[variant ?? "default"]} ${textSizeClass[size ?? "default"]}`;
}
