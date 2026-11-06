import { playModalClose, playModalOpen } from "@/shared/audio/ui-sound";
import { Icon } from "@/shared/components/ui/Icon";
import {
  ROUND_ICON_BUTTON_CLASS,
  ROUND_ICON_BUTTON_HIT_SLOP,
  ROUND_ICON_BUTTON_ICON_CLASS,
  ROUND_ICON_BUTTON_ICON_SIZE,
} from "@/shared/components/ui/icon-button-classes";
import { messages } from "@/shared/i18n";
import { fadeTiming, panelTiming } from "@/shared/motion/motion-presets";
import { IconX } from "@tabler/icons-react-native";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import { OverlayScrim } from "./OverlayScrim";

type SideDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const DRAWER_WIDTH = 288;
const DRAWER_GUTTER = 48;

export function SideDrawer({ isOpen, onClose, children }: SideDrawerProps) {
  const reduced = useReducedMotion();
  const { width: screenWidth } = useWindowDimensions();
  const width = Math.min(DRAWER_WIDTH, screenWidth - DRAWER_GUTTER);
  const [mounted, setMounted] = useState(isOpen);
  const progress = useSharedValue(0);

  if (isOpen && !mounted) setMounted(true);

  useEffect(() => {
    if (isOpen) {
      playModalOpen();
      progress.value = withTiming(1, panelTiming(reduced));
      return;
    }
    progress.value = withTiming(0, fadeTiming(reduced), (finished) => {
      if (finished) scheduleOnRN(setMounted, false);
    });
  }, [isOpen, progress, reduced]);

  const close = () => {
    playModalClose();
    onClose();
  };

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={() => {}}
    >
      <SafeAreaProvider style={StyleSheet.absoluteFill}>
        <DrawerLayer progress={progress} width={width} onClose={close}>
          {children}
        </DrawerLayer>
      </SafeAreaProvider>
    </Modal>
  );
}

type DrawerLayerProps = {
  progress: SharedValue<number>;
  width: number;
  onClose: () => void;
  children: React.ReactNode;
};

function DrawerLayer({ progress, width, onClose, children }: DrawerLayerProps) {
  const insets = useSafeAreaInsets();
  const scrimStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (1 - progress.value) * width }],
  }));

  return (
    <>
      <Animated.View style={[StyleSheet.absoluteFill, scrimStyle]}>
        <Pressable
          accessibilityLabel={messages.Common.close}
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        >
          <OverlayScrim />
        </Pressable>
      </Animated.View>
      <Animated.View style={[styles.panel, { width }, panelStyle]}>
        <View
          style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }}
          className="flex-1 rounded-l-xl border-l border-border bg-popover px-5 shadow-2xl"
        >
          {children}
        </View>
        <Pressable
          role="button"
          accessibilityLabel={messages.Common.close}
          hitSlop={ROUND_ICON_BUTTON_HIT_SLOP}
          onPress={onClose}
          style={{ top: insets.top + 16 }}
          className={`absolute right-4 ${ROUND_ICON_BUTTON_CLASS}`}
        >
          <Icon as={IconX} size={ROUND_ICON_BUTTON_ICON_SIZE} className={ROUND_ICON_BUTTON_ICON_CLASS} />
        </Pressable>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  panel: { position: "absolute", top: 0, bottom: 0, right: 0 },
});

export type { SideDrawerProps };
