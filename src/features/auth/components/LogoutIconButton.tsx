import { useAuthStore } from "@/features/auth/store";
import { useThemeColors } from "@/shared/hooks";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";

export const LogoutIconButton = () => {
  const { primary } = useThemeColors();
  const { logout } = useAuthStore();

  return (
    <TouchableOpacity onPress={() => void logout()}>
      <Ionicons name="log-out-outline" size={24} color={primary} style={{ marginRight: 10 }} />
    </TouchableOpacity>
  );
};
