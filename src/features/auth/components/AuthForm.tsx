import { authCopy } from "@/features/auth/lib/auth-messages";
import {
  loginSchema,
  registerSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from "@/features/auth/schemas";
import {
  ThemedButton,
  ThemedLink,
  ThemedText,
  ThemedTextInput,
} from "@/shared";
import { useAppTheme } from "@/shared/theme";
import { Formik } from "formik";
import type { ComponentPropsWithoutRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { toFormikValidationSchema } from "zod-formik-adapter";

type Mode = "login" | "register";

interface AuthFormProps {
  mode: Mode;
  loading?: boolean;
  formError?: string | null;
  onSubmitLogin: (values: LoginFormValues) => void | Promise<void>;
  onSubmitRegister: (values: RegisterFormValues) => void | Promise<void>;
}

const loginInitial: LoginFormValues = { email: "", password: "" };
const registerInitial: RegisterFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function AuthForm({
  mode,
  loading,
  formError,
  onSubmitLogin,
  onSubmitRegister,
}: AuthFormProps) {
  const { colors } = useAppTheme();
  const isRegister = mode === "register";
  const title = isRegister ? authCopy.register_title : authCopy.login_title;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingVertical: 48,
        }}
      >
        <View className="mx-auto w-full max-w-sm gap-2">
          <ThemedText className="mb-1 text-center font-figtree-semibold text-2xl">
            Nexpenses
          </ThemedText>
          <ThemedText className="mb-6 font-figtree-semibold text-3xl">
            {title}
          </ThemedText>

          {isRegister ? (
            <Formik
              initialValues={registerInitial}
              validationSchema={toFormikValidationSchema(registerSchema)}
              validateOnChange
              onSubmit={async (values) => {
                await onSubmitRegister(values);
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isValid,
              }) => (
                <View className="gap-3">
                  <Field
                    label={authCopy.first_name}
                    value={values.firstName}
                    onChangeText={handleChange("firstName")}
                    onBlur={handleBlur("firstName")}
                    error={touched.firstName ? errors.firstName : undefined}
                    autoComplete="given-name"
                    placeholder="Escribe tu nombre"
                  />
                  <Field
                    label={authCopy.last_name}
                    value={values.lastName}
                    onChangeText={handleChange("lastName")}
                    onBlur={handleBlur("lastName")}
                    error={touched.lastName ? errors.lastName : undefined}
                    autoComplete="family-name"
                    placeholder="Escribe tu apellido"
                  />
                  <Field
                    label={authCopy.email}
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    error={touched.email ? errors.email : undefined}
                    autoComplete="email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="ana@example.com"
                  />
                  <Field
                    label={authCopy.password}
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    error={touched.password ? errors.password : undefined}
                    secureTextEntry
                    autoComplete="new-password"
                    placeholder="Escribe tu contraseña"
                  />
                  <Field
                    label="Confirmar contraseña"
                    value={values.confirmPassword}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    error={
                      touched.confirmPassword
                        ? errors.confirmPassword
                        : undefined
                    }
                    secureTextEntry
                    autoComplete="new-password"
                    placeholder="Repite tu contraseña"
                  />
                  <ThemedButton
                    onPress={() => handleSubmit()}
                    disabled={loading || !isValid}
                  >
                    {authCopy.register_action}
                  </ThemedButton>
                  {formError ? (
                    <ThemedText className="text-sm text-destructive">
                      {formError}
                    </ThemedText>
                  ) : null}
                </View>
              )}
            </Formik>
          ) : (
            <Formik
              initialValues={loginInitial}
              validationSchema={toFormikValidationSchema(loginSchema)}
              validateOnChange
              onSubmit={async (values) => {
                await onSubmitLogin(values);
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isValid,
              }) => (
                <View className="gap-3">
                  <Field
                    label={authCopy.email}
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    error={touched.email ? errors.email : undefined}
                    autoComplete="email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="ana@example.com"
                  />
                  <Field
                    label={authCopy.password}
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    error={touched.password ? errors.password : undefined}
                    secureTextEntry
                    autoComplete="password"
                    placeholder="Escribe tu contraseña"
                  />
                  <ThemedButton
                    onPress={() => handleSubmit()}
                    disabled={loading || !isValid}
                  >
                    {authCopy.login_action}
                  </ThemedButton>
                  {formError ? (
                    <ThemedText className="text-sm text-destructive">
                      {formError}
                    </ThemedText>
                  ) : null}
                </View>
              )}
            </Formik>
          )}

          <View className="my-5 flex-row items-center gap-3">
            <View className="h-px flex-1 bg-light-border dark:bg-dark-border" />
            <ThemedText muted>{authCopy.or}</ThemedText>
            <View className="h-px flex-1 bg-light-border dark:bg-dark-border" />
          </View>

          <Pressable
            disabled
            className="h-12 items-center justify-center rounded-lg border border-light-border opacity-50 dark:border-dark-border"
          >
            <ThemedText muted>{authCopy.google}</ThemedText>
          </Pressable>

          {mode === "login" ? (
            <ThemedLink href="/(auth)/register" className="mt-4 text-center">
              {authCopy.go_register}
            </ThemedLink>
          ) : (
            <ThemedLink href="/(auth)/login" className="mt-4 text-center">
              {authCopy.go_login}
            </ThemedLink>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  error,
  ...props
}: {
  label: string;
  error?: string;
} & ComponentPropsWithoutRef<typeof ThemedTextInput>) {
  return (
    <View className="gap-1.5">
      <ThemedText className="text-sm font-figtree-medium">{label}</ThemedText>
      <ThemedTextInput {...props} />
      {error ? (
        <ThemedText className="text-sm text-destructive">{error}</ThemedText>
      ) : null}
    </View>
  );
}
