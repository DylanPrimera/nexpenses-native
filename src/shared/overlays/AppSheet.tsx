import { playModalClose, playModalOpen } from "@/shared/audio/ui-sound";
import { SheetScope } from "@/shared/components/ui/scoped-text-input";
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
import { SheetBackdrop, StaticSheetBackdrop } from "./SheetBackdrop";
import { SheetBackground, SheetCloseButton, SheetHandle } from "./SheetChrome";
import { acquireOverlay } from "./overlay-registry";
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
  dismissible?: boolean;
};

const MAX_HEIGHT_RATIO = 0.9;
const SHEET_PAN_ACTIVE_Y: [number, number] = [-10, 10];
const SHEET_PAN_FAIL_X: [number, number] = [-10, 10];

export function AppSheet({
  isOpen,
  onChange,
  children,
  header,
  footer,
  showClose = true,
  fullHeight = false,
  contentClassName,
  dismissible = true,
}: AppSheetProps) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const presented = useRef(false);
  const releaseOverlay = useRef<(() => void) | null>(null);
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
      releaseOverlay.current ??= acquireOverlay();
      sheetRef.current?.present();
      playModalOpen();
    }
    if (!isOpen && presented.current) {
      sheetRef.current?.dismiss();
    }
  }, [isOpen]);

  useEffect(
    () => () => {
      releaseOverlay.current?.();
      releaseOverlay.current = null;
    },
    [],
  );

  const handleDismiss = () => {
    presented.current = false;
    releaseOverlay.current?.();
    releaseOverlay.current = null;
    playModalClose();
    onChange(false);
  };

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props}>
        <View
          onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}
          className="bg-popover px-5 pt-4"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <SheetScope>{footer}</SheetScope>
        </View>
      </BottomSheetFooter>
    ),
    [footer, insets.bottom],
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      stackBehavior="push"
      onDismiss={handleDismiss}
      enableDynamicSizing={!fullHeight}
      snapPoints={fullHeight ? [maxHeight] : undefined}
      maxDynamicContentSize={maxHeight}
      topInset={insets.top}
      enablePanDownToClose={dismissible}
      activeOffsetY={SHEET_PAN_ACTIVE_Y}
      failOffsetX={SHEET_PAN_FAIL_X}
      animationConfigs={animationConfigs}
      backdropComponent={dismissible ? SheetBackdrop : StaticSheetBackdrop}
      backgroundComponent={SheetBackground}
      handleComponent={SheetHandle}
      footerComponent={footer ? renderFooter : undefined}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <BottomSheetScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: footer ? footerHeight : insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <SheetScope>
          {header ? <View className="px-5 pr-16 pt-1">{header}</View> : null}
          <View className={`px-5 ${header ? "py-4" : "pt-1"} ${contentClassName ?? ""}`}>
            {children}
          </View>
        </SheetScope>
      </BottomSheetScrollView>
      {showClose && dismissible ? (
        <SheetCloseButton onPress={() => sheetRef.current?.dismiss()} />
      ) : null}
    </BottomSheetModal>
  );
}

export type { AppSheetProps };
