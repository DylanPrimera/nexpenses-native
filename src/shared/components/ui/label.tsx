import * as LabelPrimitive from '@rn-primitives/label';

function Label({
  className,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  disabled,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Text>) {
  return (
    <LabelPrimitive.Root
      className={`flex select-none flex-row items-center gap-2 ${disabled ? 'opacity-50' : ''}`}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}>
      <LabelPrimitive.Text
        className={className ?? 'font-figtree-medium text-sm text-foreground'}
        {...props}
      />
    </LabelPrimitive.Root>
  );
}

export { Label };
