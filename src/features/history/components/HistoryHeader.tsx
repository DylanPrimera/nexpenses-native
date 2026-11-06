import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/Icon";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconList,
  type Icon as TablerIconType,
} from "@tabler/icons-react-native";
import { Pressable, View } from "react-native";
import type { HistoryMonth, HistoryView } from "../interfaces";
import { expensesRegisteredLabel, historyMonthTitle } from "../lib/history-month";

type HistoryHeaderProps = {
  month: HistoryMonth;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  view: HistoryView;
  onViewChange: (view: HistoryView) => void;
  count: number | undefined;
};

const VIEW_OPTIONS: { id: HistoryView; label: string; icon: TablerIconType }[] = [
  { id: "list", label: messages.History.view_list, icon: IconList },
  { id: "calendar", label: messages.History.view_calendar, icon: IconCalendar },
];

function ViewToggle({ view, onChange }: { view: HistoryView; onChange: (view: HistoryView) => void }) {
  return (
    <View role="radiogroup" className="flex-row rounded-md bg-muted p-1">
      {VIEW_OPTIONS.map((option) => {
        const selected = view === option.id;
        return (
          <Pressable
            key={option.id}
            role="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(option.id)}
            className={`size-10 items-center justify-center rounded-md ${selected ? "bg-primary" : "active:bg-accent"}`}
          >
            <Icon
              as={option.icon}
              size={20}
              className={selected ? "text-primary-foreground" : "text-muted-foreground"}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

export function HistoryHeader({
  month,
  canGoNext,
  onPrevious,
  onNext,
  view,
  onViewChange,
  count,
}: HistoryHeaderProps) {
  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between gap-3">
        <View className="min-w-0 flex-1 flex-row items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon-sm"
            accessibilityLabel={messages.Common.previous_month}
            onPress={onPrevious}
          >
            <Icon as={IconChevronLeft} size={20} />
          </Button>
          <Text role="heading" numberOfLines={1} className="shrink font-figtree-bold text-lg tracking-tight">
            {historyMonthTitle(month)}
          </Text>
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={!canGoNext}
            accessibilityLabel={messages.Common.next_month}
            onPress={onNext}
          >
            <Icon as={IconChevronRight} size={20} />
          </Button>
        </View>
        <ViewToggle view={view} onChange={onViewChange} />
      </View>
      <View className="flex-row items-center gap-1.5 px-1">
        <View className="size-1.5 rounded-full bg-primary" />
        {count === undefined ? (
          <Skeleton className="h-3 w-44 rounded-md" />
        ) : (
          <Text className="text-xs text-muted-foreground">{expensesRegisteredLabel(count, month)}</Text>
        )}
      </View>
    </View>
  );
}
