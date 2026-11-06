import { Slot } from '@rn-primitives/slot';
import * as React from 'react';
import { textClassName } from '@/shared/components/ui/text-class-name';
import { Platform, Text as RNText, type Role } from 'react-native';

type TextVariant =
  | 'default'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'p'
  | 'blockquote'
  | 'code'
  | 'lead'
  | 'large'
  | 'small'
  | 'muted';

const variantClass: Record<TextVariant, string> = {
  default: '',
  h1: 'text-center font-figtree-bold text-4xl tracking-tight',
  h2: 'border-b border-border pb-2 font-figtree-semibold text-3xl tracking-tight',
  h3: 'font-figtree-semibold text-2xl tracking-tight',
  h4: 'font-figtree-semibold text-xl tracking-tight',
  p: 'mt-3 leading-7',
  blockquote: 'mt-4 border-l-2 pl-3 italic',
  code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
  lead: 'text-xl text-muted-foreground',
  large: 'font-figtree-semibold text-lg',
  small: 'font-figtree-medium text-sm leading-none',
  muted: 'text-sm text-muted-foreground',
};

const ROLE: Partial<Record<TextVariant, Role>> = {
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  blockquote: Platform.select({ web: 'blockquote' as Role }),
  code: Platform.select({ web: 'code' as Role }),
};

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  h1: '1',
  h2: '2',
  h3: '3',
  h4: '4',
};

const TextClassContext = React.createContext<string | undefined>(undefined);

type TextProps = React.ComponentProps<typeof RNText> & {
  asChild?: boolean;
  variant?: TextVariant;
};

function Text({ className, asChild = false, variant = 'default', ...props }: TextProps) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot : RNText;
  return (
    <Component
      className={textClassName(variantClass[variant], textClass, className)}
      role={ROLE[variant]}
      aria-level={ARIA_LEVEL[variant]}
      {...props}
    />
  );
}

export { Text, TextClassContext, textClassName };
export type { TextProps, TextVariant };
