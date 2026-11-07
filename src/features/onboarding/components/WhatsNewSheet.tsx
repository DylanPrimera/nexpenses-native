import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { tx } from "@/shared/i18n/format";
import { AppSheet } from "@/shared/overlays/AppSheet";
import { IconMapPin } from "@tabler/icons-react-native";
import { useRef, useState } from "react";
import { View } from "react-native";
import type { NewsItem } from "../interfaces";

type WhatsNewSheetProps = {
  items: readonly NewsItem[];
  onClose: (viewedIds: readonly string[]) => void;
};

export function WhatsNewSheet({ items, onClose }: WhatsNewSheetProps) {
  const [open, setOpen] = useState(true);
  const [index, setIndex] = useState(0);
  const furthest = useRef(0);
  const item = items[index];
  const isFirst = index === 0;
  const isLast = index === items.length - 1;

  const goTo = (next: number) => {
    furthest.current = Math.max(furthest.current, next);
    setIndex(next);
  };

  const handleChange = (next: boolean) => {
    setOpen(next);
    if (!next) onClose(items.slice(0, furthest.current + 1).map((news) => news.id));
  };

  if (!item) return null;

  return (
    <AppSheet
      isOpen={open}
      onChange={handleChange}
      footer={
        <View className="flex-row items-center justify-between gap-3">
          <Text className="text-xs text-muted-foreground">
            {tx(messages.WhatsNew.progress, { current: index + 1, total: items.length })}
          </Text>
          <View className="flex-row items-center gap-2">
            {isFirst ? null : (
              <Button variant="outline" onPress={() => goTo(index - 1)}>
                <Text>{messages.WhatsNew.previous}</Text>
              </Button>
            )}
            <Button onPress={isLast ? () => setOpen(false) : () => goTo(index + 1)}>
              <Text>{isLast ? messages.WhatsNew.done : messages.WhatsNew.next}</Text>
            </Button>
          </View>
        </View>
      }
    >
      <View accessibilityLabel={messages.WhatsNew.dialog_label} className="gap-3">
        <View className="flex-row items-center gap-3">
          <View className="size-12 items-center justify-center rounded-[0.875rem] bg-primary/15">
            <Icon as={item.icon} size={26} strokeWidth={2} className="text-primary" />
          </View>
          <View className="self-center rounded-md bg-primary/10 px-3 py-1">
            <Text className="font-figtree-medium text-xs text-primary">{item.badge}</Text>
          </View>
        </View>
        <Text role="heading" className="font-figtree-bold text-xl tracking-tight">
          {item.title}
        </Text>
        <Text className="text-sm text-muted-foreground">{item.body}</Text>
        <View className="flex-row gap-2 rounded-[0.875rem] bg-card p-3">
          <Icon as={IconMapPin} size={16} className="mt-0.5 text-primary" />
          <Text className="flex-1 text-sm">{item.where}</Text>
        </View>
      </View>
    </AppSheet>
  );
}
