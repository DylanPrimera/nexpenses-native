import { playPressSound } from "@/shared/audio/ui-sound";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface FABProps {
  iconName: IconName;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export const FAB = ({ style, iconName, onPress }: FABProps) => {
  return (
    <TouchableOpacity
      onPress={() => {
        playPressSound();
        onPress();
      }}
      style={[
        {
          position: "absolute",
          bottom: 30,
          right: 20,
          width: 60,
          height: 60,
          shadowColor: "black",
          backgroundColor: "black",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.4,
          shadowRadius: 10,
          elevation: 3,
          borderRadius: 13,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Ionicons name={iconName} size={30} color="white" />
    </TouchableOpacity>
  );
};
