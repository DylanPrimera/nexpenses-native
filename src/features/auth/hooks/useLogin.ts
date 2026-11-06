import { useState } from "react";
import { Alert } from "react-native";
import { useAuthStore } from "../store";

export const useLogin = () => {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const ok = await login(email, password);
      if (!ok) {
        Alert.alert("Error", "Ocurrió un error al iniciar sesión");
      }
      return ok;
    } catch {
      Alert.alert("Error", "Ocurrió un error al iniciar sesión");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, isLoading };
};
