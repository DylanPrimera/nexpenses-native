import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { AppSheet } from "@/shared/overlays/AppSheet";
import { IconSparkles } from "@tabler/icons-react-native";
import { useRef, useState } from "react";
import { View } from "react-native";

type TourOfferSheetProps = {
  onAccept: () => void;
  onDecline: () => void;
};

export function TourOfferSheet({ onAccept, onDecline }: TourOfferSheetProps) {
  const [open, setOpen] = useState(true);
  const accepted = useRef(false);

  const handleChange = (next: boolean) => {
    setOpen(next);
    if (next) return;
    if (accepted.current) onAccept();
    else onDecline();
  };

  const handleAccept = () => {
    accepted.current = true;
    setOpen(false);
  };

  return (
    <AppSheet
      isOpen={open}
      onChange={handleChange}
      footer={
        <View className="gap-2">
          <Button size="lg" onPress={handleAccept}>
            <Text>{messages.Tour.offer_accept}</Text>
          </Button>
          <Button size="lg" variant="ghost" onPress={() => setOpen(false)}>
            <Text>{messages.Tour.offer_decline}</Text>
          </Button>
        </View>
      }
    >
      <View className="items-center gap-2">
        <View className="mb-2 size-14 items-center justify-center rounded-[0.875rem] bg-primary/15">
          <Icon as={IconSparkles} size={32} strokeWidth={2} className="text-primary-action" />
        </View>
        <Text role="heading" className="text-center font-figtree-bold text-xl tracking-tight">
          {messages.Tour.offer_title}
        </Text>
        <Text className="text-center text-sm text-muted-foreground">
          {messages.Tour.offer_description}
        </Text>
      </View>
    </AppSheet>
  );
}
