import { ThemedButton, useAppTheme } from "@/shared";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Asset, requestPermissionsAsync } from "expo-media-library";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useCameraStore } from "../store";

export const CameraScreen = () => {
  const { addSelectedImage } = useCameraStore();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [selectedPhoto, setSelectedPhoto] = useState<string | undefined>();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.permissionBox]}>
        <Text style={styles.message}>
          Necesitamos permiso para usar la cámara
        </Text>
        <ThemedButton onPress={requestPermission}>Conceder permisos</ThemedButton>
      </View>
    );
  }

  const onShutterButtonPress = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
    if (!photo?.uri) return;
    setSelectedPhoto(photo.uri);
  };

  const onFlipCameraButtonPress = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const onRetakeImageButtonPress = () => {
    setSelectedPhoto(undefined);
  };

  const onReturnCancelButtonPress = () => {
    setSelectedPhoto(undefined);
    router.dismiss();
  };

  const onConfirmImageButtonPress = async () => {
    const { status } = await requestPermissionsAsync(false, ["photo"]);
    if (status !== "granted") return;
    if (!selectedPhoto) return;
    addSelectedImage(selectedPhoto);
    await Asset.create(selectedPhoto);
    onRetakeImageButtonPress();
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permiso requerido",
        "Se necesita permiso para acceder a la galería.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 0.7,
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      for (const asset of result.assets) {
        if (asset.uri) addSelectedImage(asset.uri);
      }
      router.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      {selectedPhoto ? (
        <Image source={{ uri: selectedPhoto }} style={styles.camera} />
      ) : (
        <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      )}
      {!selectedPhoto ? (
        <ShutterButton onPress={onShutterButtonPress} />
      ) : (
        <ConfirmImageButton onPress={onConfirmImageButtonPress} />
      )}
      {!selectedPhoto && <FlipCameraButton onPress={onFlipCameraButtonPress} />}
      {!selectedPhoto && <GalleryButton onPress={pickImage} />}
      <ReturnCancelButton onPress={onReturnCancelButtonPress} />
      {selectedPhoto ? <RetakeImageButton onPress={onRetakeImageButtonPress} /> : null}
    </View>
  );
};

const ShutterButton = ({ onPress }: { onPress: () => void }) => {
  const dimensions = useWindowDimensions();
  return (
    <TouchableOpacity
      style={[
        styles.shutterButton,
        { position: "absolute", bottom: 30, left: dimensions.width / 2 - 32, borderColor: "grey" },
      ]}
      onPress={onPress}
    />
  );
};

const FlipCameraButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.flipCameraButton} onPress={onPress}>
    <Ionicons name="camera-reverse-outline" size={30} color="white" />
  </TouchableOpacity>
);

const GalleryButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.galleryButton} onPress={onPress}>
    <Ionicons name="image-outline" size={30} color="white" />
  </TouchableOpacity>
);

const ReturnCancelButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.returnCancelButton} onPress={onPress}>
    <Ionicons name="arrow-back-outline" size={30} color="white" />
  </TouchableOpacity>
);

const ConfirmImageButton = ({ onPress }: { onPress: () => void }) => {
  const dimensions = useWindowDimensions();
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity
      style={[
        styles.shutterButton,
        {
          position: "absolute",
          bottom: 30,
          left: dimensions.width / 2 - 32,
          borderColor: colors.primary,
          backgroundColor: colors.primary,
        },
      ]}
      onPress={onPress}
    >
      <Ionicons name="checkmark-outline" size={30} color="white" />
    </TouchableOpacity>
  );
};

const RetakeImageButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.flipCameraButton} onPress={onPress}>
    <Ionicons name="close-outline" size={30} color="white" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  permissionBox: { marginHorizontal: 30, justifyContent: "center", alignItems: "center" },
  message: { textAlign: "center", paddingBottom: 10 },
  camera: { flex: 1 },
  shutterButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "white",
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  flipCameraButton: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: "#17202A",
    position: "absolute",
    bottom: 40,
    right: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: "#17202A",
    position: "absolute",
    bottom: 40,
    left: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  returnCancelButton: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: "#17202A",
    position: "absolute",
    top: 40,
    left: 32,
    justifyContent: "center",
    alignItems: "center",
  },
});
