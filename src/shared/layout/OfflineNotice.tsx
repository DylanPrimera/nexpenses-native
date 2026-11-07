import { CONTENT_MAX_WIDTH } from "./layout-metrics";
import { View } from "react-native";
import { IconCloudOff } from "@tabler/icons-react-native";
import { useConnectivity } from "@/core/network/connectivity";
import { usePendingExpenses } from "@/features/expenses/hooks/usePendingExpenses";
import { Text } from "@/shared/components/ui/text";
import { Icon } from "@/shared/components/ui/Icon";
import { messages } from "@/shared/i18n";

export function OfflineNotice() {
  const { isReady, isOnline } = useConnectivity();
  const pending = usePendingExpenses();
  if (!isReady || (isOnline && !pending.length)) return null;
  return (
    <View
      style={{ alignSelf: "center", width: "92%", maxWidth: CONTENT_MAX_WIDTH - 32 }}
      accessibilityLiveRegion="polite"
      className="flex-row items-center gap-2 rounded-md bg-muted px-3 py-2"
    >
      <Icon as={IconCloudOff} size={18} className="text-muted-foreground" />
      <View className="flex-1">
        <Text className="font-figtree-semibold text-sm">
          {isOnline ? messages.Offline.syncing : messages.Offline.offline_title}
        </Text>
        <Text className="text-xs text-muted-foreground">
          {isOnline ? messages.Offline.waiting : messages.Offline.offline_description}
        </Text>
      </View>
    </View>
  );
}
