import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import {
  IconAlertOctagon,
  IconAlertTriangle,
  IconCircleCheck,
  IconX,
} from "@tabler/icons-react-native";
import { View } from "react-native";
import { toast } from "sonner-native";

export type ToastTone = "success" | "warning" | "error";

const toneIcon = {
  success: IconCircleCheck,
  warning: IconAlertTriangle,
  error: IconAlertOctagon,
} as const;

const toneBoxClass = {
  success: "bg-primary/15",
  warning: "border border-destructive/30 bg-destructive/10",
  error: "bg-destructive",
} as const;

const toneIconClass = {
  success: "text-primary",
  warning: "text-destructive",
  error: "text-primary-foreground",
} as const;

export const TOAST_DURATION_MS = 4000;

type ToastCardProps = { tone: ToastTone; message: string; onDismiss: () => void };

function ToastCard({ tone, message, onDismiss }: ToastCardProps) {
  return (
    <View className="mx-4 flex-row items-center gap-3 rounded-[0.875rem] border border-border bg-popover px-3 py-2.5 shadow-md shadow-black/10">
      <View
        className={`size-9 shrink-0 items-center justify-center rounded-md ${toneBoxClass[tone]}`}
      >
        <Icon as={toneIcon[tone]} size={18} strokeWidth={1.75} className={toneIconClass[tone]} />
      </View>
      <Text className="min-w-0 flex-1 font-figtree-semibold text-sm tracking-tight text-popover-foreground">
        {message}
      </Text>
      <Button
        variant="ghost"
        size="icon-sm"
        accessibilityLabel={messages.Common.close}
        onPress={onDismiss}
      >
        <Icon as={IconX} size={16} />
      </Button>
    </View>
  );
}

export function showToast(tone: ToastTone, message: string) {
  let id: string | number | undefined;
  id = toast.custom(
    <ToastCard tone={tone} message={message} onDismiss={() => toast.dismiss(id)} />,
    { duration: TOAST_DURATION_MS },
  );
  return id;
}
