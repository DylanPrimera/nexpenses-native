import { BottomSheetBackdrop, type BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { StyleSheet } from "react-native";
import { OverlayScrim } from "./OverlayScrim";

export function SheetBackdrop(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={1}
      pressBehavior="close"
      style={[props.style, styles.transparent]}
    >
      <OverlayScrim />
    </BottomSheetBackdrop>
  );
}

const styles = StyleSheet.create({
  transparent: { backgroundColor: "transparent" },
});
