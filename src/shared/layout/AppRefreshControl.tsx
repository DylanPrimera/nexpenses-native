import { useAppTheme } from "@/shared/theme";
import { useState } from "react";
import { RefreshControl, type RefreshControlProps } from "react-native";

export function usePullToRefresh(refresh: () => Promise<unknown>) {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refresh().catch(() => undefined);
    setRefreshing(false);
  };
  return { refreshing, onRefresh };
}

type AppRefreshControlProps = Omit<RefreshControlProps, "tintColor" | "colors" | "progressBackgroundColor">;

export function AppRefreshControl({ refreshing, onRefresh, ...props }: AppRefreshControlProps) {
  const { colors } = useAppTheme();
  return (
    <RefreshControl
      {...props}
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={colors.primary}
      colors={[colors.primary]}
      progressBackgroundColor={colors.card}
    />
  );
}
