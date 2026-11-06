import { AccountDrawer } from "@/features/auth";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { AppRefreshControl, PageShell, usePullToRefresh } from "@/shared/layout";
import { IconCloudOff, IconTags } from "@tabler/icons-react-native";
import { useState } from "react";
import { View } from "react-native";
import { useCategories } from "../hooks";
import type { Category } from "../interfaces";
import { sortCategoriesByUsage } from "../lib/category-display";
import { CategoryCard, CategoryCardSkeleton } from "./CategoryCard";
import { CategoryEditSheet } from "./CategoryEditSheet";

export function CategoriesScreen() {
  const categories = useCategories();
  const { refreshing, onRefresh } = usePullToRefresh(() => categories.refetch());
  const [editing, setEditing] = useState<Category | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const content = () => {
    if (categories.isError && !categories.data) {
      return (
        <View className="gap-4">
          <EmptyState
            icon={IconCloudOff}
            title={messages.Common.load_error_title}
            description={messages.Common.load_error_description}
          />
          <Button variant="secondary" onPress={() => void categories.refetch()}>
            <Text>{messages.Common.retry}</Text>
          </Button>
        </View>
      );
    }
    if (!categories.data) {
      return (
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" className="gap-2.5">
          <CategoryCardSkeleton />
          <CategoryCardSkeleton />
          <CategoryCardSkeleton />
        </View>
      );
    }
    if (categories.data.length === 0) {
      return (
        <EmptyState
          icon={IconTags}
          title={messages.Categories.empty_title}
          description={messages.Categories.empty_description}
        />
      );
    }
    return (
      <View className="gap-2.5">
        {sortCategoriesByUsage(categories.data).map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={(item) => {
              setEditing(item);
              setEditOpen(true);
            }}
          />
        ))}
      </View>
    );
  };

  return (
    <PageShell
      screenLabel={messages.Nav.categories}
      headerAction={<AccountDrawer />}
      refreshControl={<AppRefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />}
    >
      {content()}
      <CategoryEditSheet
        category={editing}
        categories={categories.data ?? []}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </PageShell>
  );
}
