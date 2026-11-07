import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/Icon";
import { SURFACE_CLASS } from "@/shared/components/ui/surface-classes";
import { Text } from "@/shared/components/ui/text";
import { messages, tx } from "@/shared/i18n";
import { IconCalendarDollar, IconX } from "@tabler/icons-react-native";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { dismissCycleNotice, isCycleNoticeDismissed } from "../lib/cycle-notice-storage";

type NewCycleNoticeProps = {
  cycleStartedAt: string;
  daysElapsed: number;
  onRegister: () => void;
};

export function NewCycleNotice({ cycleStartedAt, daysElapsed, onRegister }: NewCycleNoticeProps) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    let active = true;
    void isCycleNoticeDismissed(cycleStartedAt).then((value) => {
      if (active) setDismissed(value);
    });
    return () => {
      active = false;
    };
  }, [cycleStartedAt]);

  if (dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    void dismissCycleNotice(cycleStartedAt);
  };

  return (
    <View role="status" className={`${SURFACE_CLASS} border border-primary/30 p-4`}>
      <Pressable
        role="button"
        accessibilityLabel={messages.Budget.stale_notice_dismiss}
        onPress={dismiss}
        hitSlop={8}
        className="absolute right-2 top-2 z-10 size-8 items-center justify-center rounded-[0.5rem] active:bg-foreground/10"
      >
        <Icon as={IconX} size={16} className="text-muted-foreground" />
      </Pressable>
      <View className="flex-row items-start gap-3 pr-6">
        <View className="size-10 items-center justify-center rounded-md bg-primary/15">
          <Icon as={IconCalendarDollar} size={20} className="text-primary-action" />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="font-figtree-semibold text-sm">
            {messages.Budget.stale_notice_title}
          </Text>
          <Text className="mt-0.5 text-xs text-muted-foreground">
            {tx(messages.Budget.stale_notice_body, { days: daysElapsed })}
          </Text>
        </View>
      </View>
      <View className="mt-3 flex-row gap-2">
        <Button variant="secondary" className="flex-1" onPress={dismiss}>
          <Text>{messages.Budget.stale_notice_dismiss}</Text>
        </Button>
        <Button className="flex-1" onPress={onRegister}>
          <Text className="font-figtree-semibold">{messages.Budget.stale_notice_action}</Text>
        </Button>
      </View>
    </View>
  );
}
