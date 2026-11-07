import { useConnectivity } from "@/core/network/connectivity";
import { getQueryDisplayState } from "@/shared/layout/query-display-state";
import { listRows } from "@/shared/layout/list-rows";
import { AccountDrawer } from "@/features/auth";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { AppRefreshControl, PageShell, usePullToRefresh } from "@/shared/layout";
import { IconCloudOff, IconTags } from "@tabler/icons-react-native";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { useCategories } from "../hooks";
import type { Category } from "../interfaces";
import { sortCategoriesByUsage } from "../lib/category-display";
import { CategoryCard, CategoryCardSkeleton } from "./CategoryCard";
import { CategoryEditSheet } from "./CategoryEditSheet";

export function CategoriesScreen() {
  const { isReady, isOnline } = useConnectivity();
  const categories = useCategories();
  const { refreshing, onRefresh } = usePullToRefresh(() => categories.refetch());
  const [editing, setEditing] = useState<Category | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const state = getQueryDisplayState({
    data: categories.data,
    isReady,
    isOnline,
    isError: categories.isError,
  });
  const content = () => {
    if (state === "offline")
      return (
        <EmptyState
          icon={IconCloudOff}
          title={messages.Offline.offline_title}
          description={messages.Offline.no_data}
        />
      );
    if (state === "error") {
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
    if (!categories.data) return null;
    if (categories.data.length === 0) {
      return (
        <EmptyState
          icon={IconTags}
          title={messages.Categories.empty_title}
          description={messages.Categories.empty_description}
        />
      );
    }
    return null;
  };

  return (
    <>
      <PageShell
        screenLabel={messages.Nav.categories}
        headerAction={<AccountDrawer />}
        renderScrollable={({ contentContainerStyle }) => (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            data={listRows(sortCategoriesByUsage(categories.data ?? []), state === "loading")}
            keyExtractor={(row) => row.id}
            contentContainerStyle={contentContainerStyle}
            renderItem={({ item }) => (
              <View className="pb-2.5">
                {item.kind === "skeleton" ? (
                  <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                    <CategoryCardSkeleton />
                  </View>
                ) : (
                  <CategoryCard
                    category={item.record}
                    onEdit={(category) => {
                      setEditing(category);
                      setEditOpen(true);
                    }}
                  />
                )}
              </View>
            )}
            ListEmptyComponent={content() ?? undefined}
            refreshControl={
              <AppRefreshControl
                refreshing={isOnline && refreshing}
                onRefresh={() => {
                  if (isOnline) void onRefresh();
                }}
              />
            }
            initialNumToRender={10}
            windowSize={7}
            removeClippedSubviews={false}
          />
        )}
      />

      <CategoryEditSheet
        category={editing}
        categories={categories.data ?? []}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}
