import * as SwitchPrimitives from '@rn-primitives/switch';

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitives.Root>) {
  return (
    <SwitchPrimitives.Root
      className={`flex h-7 w-12 shrink-0 flex-row items-center rounded-full border border-transparent px-0.5 ${props.checked ? 'bg-primary' : 'bg-input dark:bg-input/80'} ${props.disabled ? 'opacity-50' : ''} ${className ?? ''}`}
      hitSlop={8}
      {...props}>
      <SwitchPrimitives.Thumb
        className={`size-6 rounded-full bg-background transition-transform ${props.checked ? 'translate-x-[18px] dark:bg-primary-foreground' : 'translate-x-0 dark:bg-foreground'}`}
      />
    </SwitchPrimitives.Root>
  );
}

export { Switch };
