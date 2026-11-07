import { useWindowDimensions, Pressable, StyleSheet, View } from "react-native";
import { useRef } from "react";
import type { AccessibilityFocusRef } from "@/shared/overlays/accessibility-focus";
import { formatCOPCurrency } from "@/core/utils/currency";
import { Icon } from "@/shared/components/ui/Icon";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { SURFACE_CLASS } from "@/shared/components/ui/surface-classes";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { IconRepeat, IconTrash } from "@tabler/icons-react-native";
import type { RecurringExpense } from "../interfaces";
import { recurringDisplay } from "../lib/recurring-display";

type RecurringCardProps = {
  template: RecurringExpense;
  onOpen: (template: RecurringExpense, target?: AccessibilityFocusRef) => void;
  onDelete: (template: RecurringExpense, target?: AccessibilityFocusRef) => void;
};

export function RecurringCard({ template, onOpen, onDelete }: RecurringCardProps) {
  const { fontScale } = useWindowDimensions();
  const openRef = useRef<React.ComponentRef<typeof Pressable>>(null);
  const deleteRef = useRef<React.ComponentRef<typeof Pressable>>(null);
  const { categoryName, paymentLabel } = recurringDisplay(template);

  return (
    <View className={`${SURFACE_CLASS} px-4 pb-1 pt-4`}>
      <Pressable
        role="button"
        accessibilityLabel={`${template.title}, ${formatCOPCurrency(template.amount)} ${messages.Common.currency}`}
        ref={openRef}
        onPress={() => onOpen(template, openRef)}
        style={StyleSheet.absoluteFill}
        className="rounded-[0.875rem] active:bg-accent"
      />
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        className="flex-row items-center gap-2"
      >
        <View className="size-11 items-center justify-center rounded-md bg-primary/15">
          <Icon as={IconRepeat} size={22} strokeWidth={1.75} className="text-primary-action" />
        </View>
        <View className="min-w-0 flex-1 gap-1">
          <View
            className={`${fontScale >= 1.3 ? "flex-col items-start" : "flex-row items-center"} justify-between gap-2`}
          >
            <Text numberOfLines={1} className="shrink font-figtree-semibold text-base">
              {template.title}
            </Text>
            <Text className="font-figtree-bold text-lg tabular-nums tracking-tight">
              {`${formatCOPCurrency(template.amount)} `}
              <Text className="text-xs text-muted-foreground">{messages.Common.currency}</Text>
            </Text>
          </View>
          <Text numberOfLines={1} className="text-xs text-muted-foreground">
            {`${categoryName} · ${paymentLabel}`}
          </Text>
        </View>
      </View>
      <View pointerEvents="box-none" className="flex-row items-center justify-end">
        <Pressable
          role="button"
          accessibilityLabel={messages.Common.delete}
          ref={deleteRef}
          onPress={() => onDelete(template, deleteRef)}
          className="size-12 items-center justify-center rounded-[0.5rem] active:bg-destructive/15"
        >
          <Icon as={IconTrash} size={20} className="text-muted-foreground" />
        </Pressable>
      </View>
    </View>
  );
}

export function RecurringCardSkeleton() {
  return (
    <View className={`${SURFACE_CLASS} gap-3 p-4`}>
      <View className="flex-row items-center gap-2">
        <Skeleton className="size-11 rounded-md" />
        <View className="flex-1 gap-2">
          <Skeleton className="h-4 w-3/5 rounded-md" />
          <Skeleton className="h-3 w-2/5 rounded-md" />
        </View>
      </View>
    </View>
  );
}
