import {
  ThemedButton,
  ThemedLink,
  ThemedText,
  ThemedTextInput,
  ThemedView,
} from "@/shared";
import { useAppTheme } from "@/shared/theme";
import { Formik } from "formik";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions, View } from "react-native";

export interface AuthFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthFormProps {
  mode: "login" | "register";
  loading?: boolean;
  onSubmit: (values: AuthFormValues) => void | Promise<void>;
}

const initialValues: AuthFormValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const AuthForm = ({ mode, loading, onSubmit }: AuthFormProps) => {
  const { height } = useWindowDimensions();
  const { colors } = useAppTheme();
  const isRegister = mode === "register";

  const validate = (values: AuthFormValues) => {
    const errors: Partial<Record<keyof AuthFormValues, string>> = {};

    if (isRegister && !values.fullName.trim()) {
      errors.fullName = "Requerido";
    }
    if (!values.email.trim()) {
      errors.email = "Requerido";
    }
    if (!values.password.trim()) {
      errors.password = "Requerido";
    }
    if (isRegister) {
      if (!values.confirmPassword.trim()) {
        errors.confirmPassword = "Requerido";
      } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "No coinciden";
      }
    }

    return errors;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 40 }}
      >
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={async (values) => {
            if (
              !values.email.trim() ||
              !values.password.trim() ||
              (isRegister && (!values.fullName.trim() || !values.confirmPassword.trim()))
            ) {
              Alert.alert("Error", "Por favor completa todos los campos");
              return;
            }
            if (isRegister && values.password !== values.confirmPassword) {
              Alert.alert("Error", "Las contraseñas no coinciden");
              return;
            }
            await onSubmit(values);
          }}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <ThemedView style={{ backgroundColor: "transparent" }}>
              <View style={{ paddingTop: height * 0.25 }}>
                <ThemedText variant="title">
                  {isRegister ? "Crear cuenta" : "Iniciar sesión"}
                </ThemedText>
                <ThemedText muted className="mt-1">
                  {isRegister
                    ? "Completa el formulario. Todos los campos son obligatorios."
                    : "¡Bienvenido de nuevo! Ingresa tus datos."}
                </ThemedText>
              </View>

              <View style={{ marginTop: 20 }}>
                {isRegister ? (
                  <ThemedTextInput
                    placeholder="Nombre completo"
                    autoCapitalize="words"
                    icon="person-outline"
                    value={values.fullName}
                    onChangeText={handleChange("fullName")}
                  />
                ) : null}

                <ThemedTextInput
                  placeholder="Correo"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon="mail-outline"
                  value={values.email}
                  onChangeText={handleChange("email")}
                />
                {touched.email && errors.email ? (
                  <ThemedText muted className="mb-2">{errors.email}</ThemedText>
                ) : null}

                <ThemedTextInput
                  placeholder="Contraseña"
                  secureTextEntry
                  autoCapitalize="none"
                  icon="lock-closed-outline"
                  value={values.password}
                  onChangeText={handleChange("password")}
                />

                {isRegister ? (
                  <ThemedTextInput
                    placeholder="Confirmar contraseña"
                    secureTextEntry
                    autoCapitalize="none"
                    icon="lock-closed-outline"
                    value={values.confirmPassword}
                    onChangeText={handleChange("confirmPassword")}
                  />
                ) : null}
                {touched.confirmPassword && errors.confirmPassword ? (
                  <ThemedText muted className="mb-2">{errors.confirmPassword}</ThemedText>
                ) : null}
              </View>

              <View style={{ marginTop: 20 }}>
                <ThemedButton
                  icon={isRegister ? "checkmark-circle-outline" : "arrow-forward-outline"}
                  loading={loading}
                  onPress={() => handleSubmit()}
                >
                  {isRegister ? "Registrarme" : "Entrar"}
                </ThemedButton>
              </View>

              <View
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <ThemedText>
                  {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
                </ThemedText>
                <ThemedLink
                  href={isRegister ? "/(auth)/login" : "/(auth)/register"}
                  style={{ textDecorationLine: "underline" }}
                >
                  {isRegister ? "Inicia sesión" : "Regístrate"}
                </ThemedLink>
              </View>
            </ThemedView>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
