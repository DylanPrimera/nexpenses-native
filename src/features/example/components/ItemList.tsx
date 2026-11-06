import { FullScreenLoader, ThemedText, ThemedView } from "@/shared";
import { useThemeColors } from "@/shared/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, View } from "react-native";
import { useItems } from "../hooks";
import { ItemCard } from "./ItemCard";

interface ItemListProps {
  onPressItem: (id: number) => void;
}

export const ItemList = ({ onPressItem }: ItemListProps) => {
  const { itemsQuery, loadNextPage } = useItems();
  const { primary } = useThemeColors();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onPullToRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["items", "infinite"] });
    setIsRefreshing(false);
  };

  if (itemsQuery.isLoading) {
    return <FullScreenLoader />;
  }

  if (itemsQuery.isError) {
    return (
      <ThemedView className="flex-1 items-center justify-center px-6">
        <ThemedText>No se pudieron cargar los ítems.</ThemedText>
        <ThemedText variant="link" className="mt-3" onPress={() => itemsQuery.refetch()}>
          Reintentar
        </ThemedText>
      </ThemedView>
    );
  }

  const items = itemsQuery.data?.pages.flat() ?? [];

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
      renderItem={({ item }) => (
        <ItemCard item={item} onPress={() => onPressItem(item.id)} />
      )}
      onEndReached={() => {
        if (itemsQuery.hasNextPage && !itemsQuery.isFetchingNextPage) {
          loadNextPage();
        }
      }}
      onEndReachedThreshold={0.8}
      ListFooterComponent={() =>
        itemsQuery.isFetchingNextPage ? (
          <View style={{ paddingVertical: 10 }}>
            <ActivityIndicator color={primary} />
          </View>
        ) : null
      }
      ListEmptyComponent={<ThemedText muted>No hay ítems.</ThemedText>}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onPullToRefresh}
          colors={[primary]}
        />
      }
    />
  );
};
