import { Icon } from "@/shared/components/ui/Icon";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { SURFACE_CLASS } from "@/shared/components/ui/surface-classes";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { IconPencil } from "@tabler/icons-react-native";
import { Pressable, View } from "react-native";
import type { Category } from "../interfaces";
import { categoryCountLabel } from "../lib/category-display";

type CategoryCardProps = {
  category: Category;
  onEdit: (category: Category) => void;
};

export function CategoryCard({ category, onEdit }: CategoryCardProps) {
  return (
    <View className={`${SURFACE_CLASS} flex-row items-center gap-3 py-2 pl-4 pr-2`}>
      <View style={{ backgroundColor: category.color }} className="size-3 rounded-full" />
      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} className="font-figtree-semibold text-sm capitalize">
          {category.name}
        </Text>
        <Text className="text-xs text-muted-foreground">{categoryCountLabel(category.usageCount)}</Text>
      </View>
      <Pressable
        role="button"
        accessibilityLabel={`${messages.Common.edit} ${category.name}`}
        onPress={() => onEdit(category)}
        className="size-11 items-center justify-center rounded-[0.5rem] active:bg-primary/15"
      >
        <Icon as={IconPencil} size={20} className="text-muted-foreground" />
      </Pressable>
    </View>
  );
}

export function CategoryCardSkeleton() {
  return (
    <View className={`${SURFACE_CLASS} flex-row items-center gap-3 p-4`}>
      <Skeleton className="size-3 rounded-full" />
      <View className="flex-1 gap-2">
        <Skeleton className="h-4 w-2/5 rounded-md" />
        <Skeleton className="h-3 w-1/4 rounded-md" />
      </View>
    </View>
  );
}
