import { Icon } from '@/shared/components/ui/Icon';
import { NativeOnlyAnimatedView } from '@/shared/components/ui/native-only-animated-view';
import { TextClassContext } from '@/shared/components/ui/text';
import * as SelectPrimitive from '@rn-primitives/select';
import { IconCheck, IconChevronDown, IconChevronUp } from '@tabler/icons-react-native';
import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { FadeIn, FadeOut, ReduceMotion } from 'react-native-reanimated';
import { DURATION_FAST_MS, EASE_OUT } from '@/shared/motion/motion-presets';
import { FullWindowOverlay as RNFullWindowOverlay } from 'react-native-screens';

type Option = SelectPrimitive.Option;

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

function SelectValue({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value> & {
    className?: string;
  }) {
  const { value } = SelectPrimitive.useRootContext();
  return (
    <SelectPrimitive.Value
      ref={ref}
      className={`line-clamp-1 flex flex-row items-center gap-2 font-figtree-regular text-sm ${value ? 'text-foreground' : 'text-muted-foreground'} ${className ?? ''}`}
      {...props}
    />
  );
}

function SelectTrigger({
  ref,
  className,
  children,
  size = 'default',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
    children?: React.ReactNode;
    size?: 'default' | 'sm';
  }) {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={`flex flex-row items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 dark:bg-input/30 dark:active:bg-input/50 ${size === 'sm' ? 'h-9 py-1.5' : 'h-11 py-2'} ${props.disabled ? 'opacity-50' : ''} ${className ?? ''}`}
      {...props}>
      <>{children}</>
      <Icon as={IconChevronDown} aria-hidden={true} size={16} className="text-muted-foreground" />
    </SelectPrimitive.Trigger>
  );
}

const FullWindowOverlay = Platform.OS === 'ios' ? RNFullWindowOverlay : React.Fragment;

function SelectContent({
  className,
  children,
  position = 'popper',
  portalHost,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
    className?: string;
    portalHost?: string;
  }) {
  return (
    <SelectPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <SelectPrimitive.Overlay
          style={Platform.select({ native: StyleSheet.absoluteFill })}
          asChild={Platform.OS !== 'web'}>
          <NativeOnlyAnimatedView
            className="z-50"
            entering={FadeIn.duration(DURATION_FAST_MS).easing(EASE_OUT).reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.duration(DURATION_FAST_MS).easing(EASE_OUT).reduceMotion(ReduceMotion.System)}
            as="Pressable">
            <TextClassContext.Provider value="text-popover-foreground">
              <SelectPrimitive.Content
                className={`relative z-50 min-w-[8rem] rounded-md border border-border bg-popover p-1 shadow-md shadow-black/5 ${className ?? ''}`}
                position={position}
                {...props}>
                <SelectScrollUpButton />
                <SelectPrimitive.Viewport
                  className={`p-1 ${position === 'popper' ? 'w-full' : ''}`}>
                  {children}
                </SelectPrimitive.Viewport>
                <SelectScrollDownButton />
              </SelectPrimitive.Content>
            </TextClassContext.Provider>
          </NativeOnlyAnimatedView>
        </SelectPrimitive.Overlay>
      </FullWindowOverlay>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={`px-2 py-2 font-figtree-regular text-xs text-muted-foreground ${className ?? ''}`}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={`group relative flex min-h-11 w-full flex-row items-center gap-2 rounded-sm py-2.5 pl-3 pr-8 active:bg-accent ${props.disabled ? 'opacity-50' : ''} ${className ?? ''}`}
      {...props}>
      <View className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Icon as={IconCheck} size={16} className="text-muted-foreground shrink-0" />
        </SelectPrimitive.ItemIndicator>
      </View>
      <SelectPrimitive.ItemText className="text-foreground font-figtree-regular group-active:text-accent-foreground select-none text-sm" />
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      className={`-mx-1 my-1 h-px bg-border ${className ?? ''}`}
      {...props}
    />
  );
}

/**
 * @platform Web only
 * Returns null on native platforms
 */
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  if (Platform.OS !== 'web') {
    return null;
  }
  return (
    <SelectPrimitive.ScrollUpButton
      className={`flex cursor-default items-center justify-center py-1 ${className ?? ''}`}
      {...props}>
      <Icon as={IconChevronUp} size={16} />
    </SelectPrimitive.ScrollUpButton>
  );
}

/**
 * @platform Web only
 * Returns null on native platforms
 */
function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  if (Platform.OS !== 'web') {
    return null;
  }
  return (
    <SelectPrimitive.ScrollDownButton
      className={`flex cursor-default items-center justify-center py-1 ${className ?? ''}`}
      {...props}>
      <Icon as={IconChevronDown} size={16} />
    </SelectPrimitive.ScrollDownButton>
  );
}



export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type Option,
};
