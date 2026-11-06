import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { IconAlertTriangle, IconReceipt2, IconTrash } from "@tabler/icons-react-native";
import { Pressable, View } from "react-native";
import { AppSheet } from "./AppSheet";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isDestructive?: boolean;
  preview?: { title: string; amount: string };
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel,
  isDestructive = true,
  preview,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const toneClass = isDestructive ? "bg-destructive" : "bg-primary";
  const confirmTextClass = isDestructive ? "text-background" : "text-primary-foreground";

  return (
    <AppSheet
      isOpen={isOpen}
      showClose={false}
      onChange={(open) => {
        if (!open) onClose();
      }}
    >
      <View className="flex-row items-start gap-3">
        <View className="size-12 shrink-0 items-center justify-center rounded-[0.875rem] bg-destructive/15">
          <Icon as={IconAlertTriangle} size={26} strokeWidth={2} className="text-destructive" />
        </View>
        <View className="min-w-0 flex-1 pt-0.5">
          <Text role="heading" className="font-figtree-semibold text-xl tracking-tight">
            {title}
          </Text>
          {isDestructive ? (
            <View className="mt-1 flex-row items-center gap-1 self-start rounded-md bg-destructive/10 px-2 py-0.5">
              <View className="size-1.5 rounded-full bg-destructive" />
              <Text className="font-figtree-semibold text-[11px] text-destructive">
                {messages.Common.permanent_action}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {preview ? (
        <View className="mt-4 flex-row items-center justify-between gap-3 rounded-lg bg-muted px-3 py-2.5">
          <View className="min-w-0 flex-1 flex-row items-center gap-2">
            <Icon as={IconReceipt2} size={18} strokeWidth={1.75} className="text-muted-foreground" />
            <Text numberOfLines={1} className="flex-1 font-figtree-medium">
              {preview.title}
            </Text>
          </View>
          <Text className="font-figtree-medium text-sm text-muted-foreground">{preview.amount}</Text>
        </View>
      ) : null}

      <Text className="mt-4 text-sm leading-relaxed text-muted-foreground">{description}</Text>

      <View className="mt-5 flex-row gap-2">
        <Pressable
          role="button"
          onPress={onClose}
          className="h-12 flex-1 items-center justify-center rounded-[0.5rem] bg-muted active:bg-accent"
        >
          <Text className="font-figtree-semibold">{messages.Common.cancel}</Text>
        </Pressable>
        <Pressable
          role="button"
          onPress={() => {
            onConfirm();
            onClose();
          }}
          className={`h-12 flex-1 flex-row items-center justify-center gap-1 rounded-[0.5rem] active:opacity-90 ${toneClass}`}
        >
          {isDestructive ? <Icon as={IconTrash} size={18} className={confirmTextClass} /> : null}
          <Text className={`font-figtree-semibold ${confirmTextClass}`}>
            {confirmLabel ?? messages.Common.confirm}
          </Text>
        </Pressable>
      </View>
    </AppSheet>
  );
}

export type { ConfirmDialogProps };
