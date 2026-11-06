import { BottomSheetBackdrop, type BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { StyleSheet } from "react-native";
import { OverlayScrim } from "./OverlayScrim";

type ScrimBackdropProps = BottomSheetBackdropProps & { pressBehavior: "close" | "none" };

function ScrimBackdrop({ pressBehavior, ...props }: ScrimBackdropProps) {
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={1}
      pressBehavior={pressBehavior}
      style={[props.style, styles.transparent]}
    >
      <OverlayScrim />
    </BottomSheetBackdrop>
  );
}

export function SheetBackdrop(props: BottomSheetBackdropProps) {
  return <ScrimBackdrop {...props} pressBehavior="close" />;
}

export function StaticSheetBackdrop(props: BottomSheetBackdropProps) {
  return <ScrimBackdrop {...props} pressBehavior="none" />;
}

const styles = StyleSheet.create({
  transparent: { backgroundColor: "transparent" },
});
