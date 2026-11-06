import { BlurView } from "expo-blur";
import { Platform, StyleSheet, View } from "react-native";
import { useOverlayBlurTarget } from "./blur-target";

const ANDROID_BLUR_MIN_SDK = 31;
const BLUR_INTENSITY = 40;

const blurSupported =
  Platform.OS === "ios" ||
  (Platform.OS === "android" && Number(Platform.Version) >= ANDROID_BLUR_MIN_SDK);

const BLUR_SCRIM = "bg-black/15 dark:bg-background/60";
const DIM_SCRIM = "bg-black/35 dark:bg-background/80";

export function OverlayScrim() {
  const blurTarget = useOverlayBlurTarget();
  const canBlur = blurSupported && (Platform.OS === "ios" || blurTarget !== null);

  return (
    <>
      {canBlur ? (
        <BlurView
          pointerEvents="none"
          intensity={BLUR_INTENSITY}
          tint="default"
          blurMethod="dimezisBlurViewSdk31Plus"
          blurTarget={blurTarget ?? undefined}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <View
        pointerEvents="none"
        className={`absolute inset-0 ${canBlur ? BLUR_SCRIM : DIM_SCRIM}`}
      />
    </>
  );
}
