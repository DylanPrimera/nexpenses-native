import type { AccessibilityFocusRef } from "./accessibility-focus";
import { useOverlayAccessibility } from "./use-overlay-accessibility";
import { playModalClose, playModalOpen } from "@/shared/audio/ui-sound";
import { SheetScope } from "@/shared/components/ui/scoped-text-input";
import { DURATION_UI_MS, EASE_OUT, motionDuration } from "@/shared/motion/motion-presets";
import {
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetFlatList,
  useBottomSheetTimingConfigs,
  type BottomSheetFooterProps,
} from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SheetBackdrop, StaticSheetBackdrop } from "./SheetBackdrop";
import { SheetBackground, SheetCloseButton, SheetHandle } from "./SheetChrome";
import { acquireOverlay, useOverlayStore } from "./overlay-registry";
import { useBlockAndroidBack } from "./use-block-android-back";

type AppSheetBaseProps = {
  isOpen: boolean;
  initialFocusRef?: AccessibilityFocusRef;
  returnFocusRef?: AccessibilityFocusRef;
  accessibilityLabel?: string;
  onChange: (open: boolean) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  showClose?: boolean;
  fullHeight?: boolean;
  contentClassName?: string;
  dismissible?: boolean;
};

export type AppSheetListLayout = { paddingBottom: number; header: React.ReactNode };
type AppSheetProps = AppSheetBaseProps &
  (
    | {
        renderScrollable: (layout: AppSheetListLayout) => React.ReactNode;
        children?: never;
      }
    | {
        renderScrollable?: never;
        children?: React.ReactNode;
      }
  );

const MAX_HEIGHT_RATIO = 0.9;
const SHEET_PAN_ACTIVE_Y: [number, number] = [-10, 10];
const SHEET_PAN_FAIL_X: [number, number] = [-10, 10];

function SheetAccessibilityLayer({ id, children }: { id: string; children: React.ReactNode }) {
  const { layerIds } = useOverlayStore();
  const isTop = layerIds.at(-1) === id;
  return (
    <View
      pointerEvents="box-none"
      style={StyleSheet.absoluteFill}
      accessibilityViewIsModal={isTop}
      accessibilityElementsHidden={!isTop}
      importantForAccessibility={isTop ? "auto" : "no-hide-descendants"}
    >
      {children}
    </View>
  );
}

function createSheetContainer(id: string) {
  return function SheetContainer({ children }: { children?: React.ReactNode }) {
    return <SheetAccessibilityLayer id={id}>{children}</SheetAccessibilityLayer>;
  };
}

export function AppSheet({
  isOpen,
  initialFocusRef,
  returnFocusRef,
  accessibilityLabel,
  onChange,
  children,
  renderScrollable,
  header,
  footer,
  showClose = true,
  fullHeight = false,
  contentClassName,
  dismissible = true,
}: AppSheetProps) {
  const id = useId();
  const [ContainerComponent] = useState(() => createSheetContainer(id));
  const closeRef = useRef<React.ComponentRef<typeof View>>(null);
  const { layerIds } = useOverlayStore();
  const isTop = layerIds.at(-1) === id;
  const { focusOnOpen, restoreFocus } = useOverlayAccessibility(
    id,
    initialFocusRef ?? closeRef,
    returnFocusRef,
  );
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
      releaseOverlay.current ??= acquireOverlay(id);
      sheetRef.current?.present();
      playModalOpen();
    }
    if (!isOpen && presented.current) {
      sheetRef.current?.dismiss();
    }
  }, [isOpen, id]);

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
    restoreFocus();
  };

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props}>
        <View
          accessibilityElementsHidden={!isTop}
          importantForAccessibility={isTop ? "auto" : "no-hide-descendants"}
          onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}
          className="bg-popover px-5 pt-4"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <SheetScope>{footer}</SheetScope>
        </View>
      </BottomSheetFooter>
    ),
    [footer, insets.bottom, isTop],
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      containerComponent={ContainerComponent}
      accessibilityLabel={accessibilityLabel}
      accessible={false}
      onChange={(index) => {
        if (index >= 0) focusOnOpen();
      }}
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
      <SheetScope>
        {renderScrollable ? (
          renderScrollable({ paddingBottom: footer ? footerHeight : insets.bottom + 20, header })
        ) : (
          <BottomSheetFlatList
            data={[]}
            renderItem={() => null}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: footer ? footerHeight : insets.bottom + 20 }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View>
                {header ? <View className="px-5 pr-16 pt-1">{header}</View> : null}
                <View className={`px-5 ${header ? "py-4" : "pt-1"} ${contentClassName ?? ""}`}>
                  {children}
                </View>
              </View>
            }
          />
        )}
      </SheetScope>
      {showClose && dismissible ? (
        <SheetCloseButton
          ref={closeRef}
          accessibilityElementsHidden={!isTop}
          importantForAccessibility={isTop ? "auto" : "no-hide-descendants"}
          onPress={() => sheetRef.current?.dismiss()}
        />
      ) : null}
    </BottomSheetModal>
  );
}

export type { AppSheetProps };
