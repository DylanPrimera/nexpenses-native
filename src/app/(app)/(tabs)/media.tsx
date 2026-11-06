import { SelectedImagesGallery, useCameraStore } from "@/features/camera";
import { FAB, ThemedButton, ThemedText, ThemedView } from "@/shared";
import { type Href, router } from "expo-router";
import { View } from "react-native";

export default function MediaScreen() {
  const { selectedImages, clearImages } = useCameraStore();
  const count = selectedImages.length;

  return (
    <ThemedView className="flex-1">
      <View className="gap-2 px-4 pt-4">
        <ThemedText variant="title">Galería demo</ThemedText>
        <ThemedText muted>
          Usa la cámara o la galería. Imágenes seleccionadas: {count}
        </ThemedText>
        {count > 0 ? (
          <ThemedButton onPress={() => clearImages()}>Limpiar</ThemedButton>
        ) : null}
      </View>
      <SelectedImagesGallery />
      <FAB iconName="camera-outline" onPress={() => router.push("/(app)/camera" as Href)} />
    </ThemedView>
  );
}
