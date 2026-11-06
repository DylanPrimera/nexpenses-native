import { useItem } from "@/features/example";
import { FullScreenLoader, ThemedText, ThemedView, useAppTheme } from "@/shared";
import { useLocalSearchParams } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = Number(id);
  const { itemQuery } = useItem({ id: numericId });
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  if (itemQuery.isLoading) {
    return <FullScreenLoader />;
  }

  if (itemQuery.isError || !itemQuery.data) {
    return (
      <ThemedView className="flex-1 items-center justify-center px-6">
        <ThemedText>No se pudo cargar el detalle.</ThemedText>
      </ThemedView>
    );
  }

  const item = itemQuery.data;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{
          gap: 12,
          padding: 10,
          paddingBottom: insets.bottom + 10,
        }}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            refreshing={itemQuery.isRefetching}
            onRefresh={async () => {
              await itemQuery.refetch();
            }}
          />
        }
      >
        <ThemedText variant="title">{item.title}</ThemedText>
        <ThemedText muted>Autor #{item.userId}</ThemedText>
        <ThemedText className="mt-2 leading-6">{item.body}</ThemedText>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
