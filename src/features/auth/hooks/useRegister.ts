import { useState } from "react";
import { Alert } from "react-native";
import { useAuthStore } from "../store";

export const useRegister = () => {
  const { register } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (fullName: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const ok = await register(fullName, email, password);
      if (!ok) {
        Alert.alert("Error", "No se pudo crear la cuenta. Revisa tus datos.");
      }
      return ok;
    } catch {
      Alert.alert("Error", "No se pudo crear la cuenta. Revisa tus datos.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, isLoading };
};
