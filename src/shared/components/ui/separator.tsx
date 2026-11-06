import * as SeparatorPrimitive from '@rn-primitives/separator';

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={`shrink-0 bg-border ${orientation === 'horizontal' ? 'h-[1px]' : 'w-[1px]'} ${className ?? (orientation === 'horizontal' ? 'w-full' : 'h-full')}`}
      {...props}
    />
  );
}

export { Separator };
