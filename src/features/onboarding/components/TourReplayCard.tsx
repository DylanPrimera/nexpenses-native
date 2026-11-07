import { Button } from "@/shared/components/ui/button";
import { SURFACE_CLASS } from "@/shared/components/ui/surface-classes";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { useOnboardingStore } from "../store/onboarding.store";

export function TourReplayCard() {
  const router = useRouter();
  const { requestReplay } = useOnboardingStore();

  const handlePress = () => {
    requestReplay();
    router.navigate("/");
  };

  return (
    <View className={`${SURFACE_CLASS} gap-3 p-4`}>
      <Text className="text-sm text-muted-foreground">{messages.Tour.replay_description}</Text>
      <Button variant="secondary" onPress={handlePress}>
        <Text>{messages.Tour.replay_button}</Text>
      </Button>
    </View>
  );
}
