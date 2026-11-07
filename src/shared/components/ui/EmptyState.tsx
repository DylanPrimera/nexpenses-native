import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import type { Icon as TablerIconType } from "@tabler/icons-react-native";
import { View } from "react-native";

type EmptyStateProps = {
  icon: TablerIconType;
  title: string;
  description?: string;
  className?: string;
};

export function EmptyState({ icon, title, description, className }: EmptyStateProps) {
  return (
    <View
      className={`items-center gap-3 rounded-[0.875rem] border border-dashed border-border px-6 py-10 ${className ?? ""}`}
    >
      <View className="size-14 items-center justify-center rounded-[0.875rem] bg-muted">
        <Icon as={icon} size={26} strokeWidth={1.75} className="text-primary-action" />
      </View>
      <Text className="text-center font-figtree-semibold text-base tracking-tight">{title}</Text>
      {description ? (
        <Text className="text-center text-sm leading-relaxed text-muted-foreground">
          {description}
        </Text>
      ) : null}
    </View>
  );
}

export type { EmptyStateProps };
