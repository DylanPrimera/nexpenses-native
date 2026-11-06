import { playModalClose, playModalOpen } from "@/shared/audio/ui-sound";
import { DURATION_UI_MS, EASE_OUT, motionDuration } from "@/shared/motion/motion-presets";
import {
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetScrollView,
  useBottomSheetTimingConfigs,
  type BottomSheetFooterProps,
} from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SheetBackdrop } from "./SheetBackdrop";
import { SheetBackground, SheetCloseButton, SheetHandle } from "./SheetChrome";
import { useBlockAndroidBack } from "./use-block-android-back";

type AppSheetProps = {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  showClose?: boolean;
  fullHeight?: boolean;
  contentClassName?: string;
};

const MAX_HEIGHT_RATIO = 0.9;

export function AppSheet({
  isOpen,
  onChange,
  children,
  header,
  footer,
  showClose = true,
  fullHeight = false,
  contentClassName,
}: AppSheetProps) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const presented = useRef(false);
  const reduced = useReducedMotion();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [footerHeight, setFooterHeight] = useState(0);
  const maxHeight = Math.round((height - insets.top) * MAX_HEIGHT_RATIO);

  const animationConfigs = useBottomSheetTimingConfigs({
    duration: motionDuration(reduced, DURATION_UI_MS),
    easing: EASE_OUT,
  });

  useBlockAndroidBack(isOpen);

  useEffect(() => {
    if (isOpen && !presented.current) {
      presented.current = true;
      sheetRef.current?.present();
      playModalOpen();
    }
    if (!isOpen && presented.current) {
      sheetRef.current?.dismiss();
    }
  }, [isOpen]);

  const handleDismiss = () => {
    presented.current = false;
    playModalClose();
    onChange(false);
  };

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props}>
        <View
          onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}
          className="border-t border-border bg-popover px-5 pt-4"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          {footer}
        </View>
      </BottomSheetFooter>
    ),
    [footer, insets.bottom],
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      onDismiss={handleDismiss}
      enableDynamicSizing={!fullHeight}
      snapPoints={fullHeight ? [maxHeight] : undefined}
      maxDynamicContentSize={maxHeight}
      enablePanDownToClose
      animationConfigs={animationConfigs}
      backdropComponent={SheetBackdrop}
      backgroundComponent={SheetBackground}
      handleComponent={SheetHandle}
      footerComponent={footer ? renderFooter : undefined}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      <BottomSheetScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: footer ? footerHeight : insets.bottom + 20 }}
      >
        {header ? <View className="px-5 pr-16 pt-1">{header}</View> : null}
        <View className={`px-5 ${header ? "py-4" : "pt-1"} ${contentClassName ?? ""}`}>
          {children}
        </View>
      </BottomSheetScrollView>
      {showClose ? <SheetCloseButton onPress={() => sheetRef.current?.dismiss()} /> : null}
    </BottomSheetModal>
  );
}

export type { AppSheetProps };
