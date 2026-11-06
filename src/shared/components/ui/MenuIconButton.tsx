import { useThemeColors } from "@/shared/hooks";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface MenuIconButtonProps {
  onPress: () => void;
  icon: IconName;
}

export const MenuIconButton = ({ onPress, icon }: MenuIconButtonProps) => {
  const { primary } = useThemeColors();
  return (
    <TouchableOpacity onPress={onPress}>
      <Ionicons name={icon} size={24} color={primary} />
    </TouchableOpacity>
  );
};
