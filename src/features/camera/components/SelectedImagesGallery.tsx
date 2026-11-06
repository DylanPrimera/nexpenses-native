import { ThemedText, ThemedView } from "@/shared";
import { Image, ScrollView, View } from "react-native";
import { useCameraStore } from "../store";

export const SelectedImagesGallery = () => {
  const { selectedImages } = useCameraStore();

  if (selectedImages.length === 0) {
    return (
      <ThemedView className="items-center px-6 py-8">
        <ThemedText muted>Aún no hay imágenes seleccionadas.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, padding: 16 }}>
      {selectedImages.map((uri) => (
        <View key={uri}>
          <Image source={{ uri }} style={{ width: 120, height: 120, borderRadius: 8 }} />
        </View>
      ))}
    </ScrollView>
  );
};
