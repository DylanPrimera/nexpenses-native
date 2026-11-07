import { playPressSound } from "@/shared/audio";
import { Icon } from "@/shared/components/ui/Icon";
import { messages } from "@/shared/i18n";
import { DURATION_UI_MS, EASE_OUT } from "@/shared/motion";
import { TOUR_TARGETS } from "@/shared/tour/tour-targets";
import { useTourTarget } from "@/shared/tour/use-tour-target";
import { IconPlus } from "@tabler/icons-react-native";
import { Pressable } from "react-native";
import Animated, { ReduceMotion, ZoomIn } from "react-native-reanimated";

const ENTERING = ZoomIn.duration(DURATION_UI_MS).easing(EASE_OUT).reduceMotion(ReduceMotion.System);

export function AddExpenseFAB({ onPress }: { onPress: () => void }) {
  const targetRef = useTourTarget(TOUR_TARGETS.fab);

  return (
    <Animated.View entering={ENTERING}>
      <Pressable
        ref={targetRef}
        role="button"
        accessibilityLabel={messages.Expense.add_title}
        onPress={() => {
          playPressSound();
          onPress();
        }}
        style={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)" }}
        className="size-12 items-center justify-center rounded-full bg-primary active:opacity-90"
      >
        <Icon as={IconPlus} size={24} strokeWidth={2.5} className="text-primary-foreground" />
      </Pressable>
    </Animated.View>
  );
}
