import { authCopy } from "@/features/auth/lib/auth-messages";
import {
  loginSchema,
  registerSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from "@/features/auth/schemas";
import {
  BackButton,
  Button,
  FormField,
  Icon,
  KeyboardScrollView,
  Separator,
  Text,
  useAppTheme,
} from "@/shared";
import {
  IconArrowRight,
  IconId,
  IconLock,
  IconLockCheck,
  IconMail,
  IconPigMoney,
  IconUser,
  IconUserPlus,
} from "@tabler/icons-react-native";
import { Link } from "expo-router";
import { Formik } from "formik";
import { useRef } from "react";
import { ActivityIndicator, Pressable, View, type TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toFormikValidationSchema } from "zod-formik-adapter";

type TextInputRef = React.ComponentRef<typeof TextInput>;
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

const EMAIL_INPUT = {
  placeholder: "ana@example.com",
  autoComplete: "email",
  textContentType: "emailAddress",
  keyboardType: "email-address",
  autoCapitalize: "none",
  autoCorrect: false,
} as const;

export function AuthForm({
  mode,
  loading = false,
  formError,
  onSubmitLogin,
  onSubmitRegister,
}: AuthFormProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const lastNameRef = useRef<TextInputRef>(null);
  const emailRef = useRef<TextInputRef>(null);
  const passwordRef = useRef<TextInputRef>(null);
  const confirmRef = useRef<TextInputRef>(null);
  const isRegister = mode === "register";
  const title = isRegister ? authCopy.register_title : authCopy.login_title;
  const description = isRegister ? authCopy.register_description : authCopy.login_description;

  return (
    <KeyboardScrollView
      keyboardDismissMode="interactive"
      showsVerticalScrollIndicator={false}
      className="flex-1 bg-background"
      contentContainerClassName="grow px-6"
      contentContainerStyle={{
        paddingTop: insets.top + (isRegister ? 8 : 32),
        paddingBottom: insets.bottom + 24,
      }}
    >
      {isRegister ? (
        <View className="mb-4 items-start">
          <BackButton href="/(auth)/login" accessibilityLabel={authCopy.back_to_login} />
        </View>
      ) : null}
      <View className="w-full flex-1 justify-center">
        <View className="mb-6 items-center justify-center gap-2">
          <IconPigMoney size={100} color={colors.primary} />
          <Text className="font-figtree-semibold text-2xl tracking-tight">Nexpenses</Text>
        </View>

        <View className="mb-8 items-center gap-2">
          <Text
            role="heading"
            className="text-center font-figtree-semibold text-4xl tracking-tight"
          >
            {title}
          </Text>
          <Text className="text-center text-base text-muted-foreground">{description}</Text>
        </View>

        {isRegister ? (
          <Formik
            initialValues={registerInitial}
            validationSchema={toFormikValidationSchema(registerSchema)}
            validateOnMount
            onSubmit={async (values) => {
              await onSubmitRegister(values);
            }}
          >
            {({ handleSubmit, isValid }) => (
              <View className="gap-4">
                <FormField
                  name="firstName"
                  label={authCopy.first_name}
                  icon={IconUser}
                  placeholder="Escribe tu nombre"
                  autoComplete="given-name"
                  textContentType="givenName"
                  autoCapitalize="words"
                  returnKeyType="next"
                  submitBehavior="submit"
                  onSubmitEditing={() => lastNameRef.current?.focus()}
                />
                <FormField
                  ref={lastNameRef}
                  name="lastName"
                  label={authCopy.last_name}
                  icon={IconId}
                  placeholder="Escribe tu apellido"
                  autoComplete="family-name"
                  textContentType="familyName"
                  autoCapitalize="words"
                  returnKeyType="next"
                  submitBehavior="submit"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
                <FormField
                  ref={emailRef}
                  name="email"
                  label={authCopy.email}
                  icon={IconMail}
                  {...EMAIL_INPUT}
                  returnKeyType="next"
                  submitBehavior="submit"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
                <FormField
                  ref={passwordRef}
                  name="password"
                  label={authCopy.password}
                  icon={IconLock}
                  placeholder="Escribe tu contraseña"
                  secureToggle
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="next"
                  submitBehavior="submit"
                  onSubmitEditing={() => confirmRef.current?.focus()}
                />
                <FormField
                  ref={confirmRef}
                  name="confirmPassword"
                  label={authCopy.confirm_password}
                  icon={IconLockCheck}
                  placeholder="Repite tu contraseña"
                  secureToggle
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="go"
                  onSubmitEditing={() => {
                    if (isValid && !loading) handleSubmit();
                  }}
                />
                <SubmitBlock
                  label={authCopy.register_action}
                  loading={loading}
                  disabled={loading || !isValid}
                  isRegister={isRegister}
                  formError={formError}
                  onPress={() => handleSubmit()}
                />
              </View>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={loginInitial}
            validationSchema={toFormikValidationSchema(loginSchema)}
            validateOnMount
            onSubmit={async (values) => {
              await onSubmitLogin(values);
            }}
          >
            {({ handleSubmit, isValid }) => (
              <View className="gap-4">
                <FormField
                  ref={emailRef}
                  name="email"
                  label={authCopy.email}
                  icon={IconMail}
                  {...EMAIL_INPUT}
                  returnKeyType="next"
                  submitBehavior="submit"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
                <FormField
                  ref={passwordRef}
                  name="password"
                  label={authCopy.password}
                  icon={IconLock}
                  placeholder="Escribe tu contraseña"
                  secureToggle
                  autoComplete="current-password"
                  textContentType="password"
                  returnKeyType="go"
                  onSubmitEditing={() => {
                    if (isValid && !loading) handleSubmit();
                  }}
                />
                <SubmitBlock
                  label={authCopy.login_action}
                  loading={loading}
                  disabled={loading || !isValid}
                  isRegister={isRegister}
                  formError={formError}
                  onPress={() => handleSubmit()}
                />
              </View>
            )}
          </Formik>
        )}

        <View className="my-6 flex-row items-center gap-3">
          <Separator className="flex-1" />
          <Text className="text-sm text-muted-foreground">{authCopy.or}</Text>
          <Separator className="flex-1" />
        </View>

        <Button variant="outline" size="lg" className="w-full" disabled>
          <Text>{authCopy.google}</Text>
        </Button>

        <Link href={isRegister ? "/(auth)/login" : "/(auth)/register"} replace asChild>
          <Pressable className="mt-2 self-center px-4 py-3" hitSlop={8}>
            <Text className="text-center text-sm text-muted-foreground">
              {isRegister ? authCopy.has_account_prompt : authCopy.no_account_prompt}{" "}
              <Text className="font-figtree-semibold text-sm text-primary underline">
                {isRegister ? authCopy.has_account_action : authCopy.no_account_action}
              </Text>
            </Text>
          </Pressable>
        </Link>
      </View>
    </KeyboardScrollView>
  );
}

function SubmitBlock({
  label,
  loading,
  disabled,
  isRegister,
  formError,
  onPress,
}: {
  label: string;
  loading: boolean;
  disabled: boolean;
  isRegister: boolean;
  formError?: string | null;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();
  return (
    <View className="mt-2">
      <Button
        size="lg"
        className="w-full gap-2"
        disabled={disabled}
        aria-busy={loading}
        onPress={onPress}
      >
        <Text>{label}</Text>
        {loading ? (
          <ActivityIndicator size="small" color={colors.primaryForeground} />
        ) : (
          <Icon as={!isRegister ? IconArrowRight : IconUserPlus} size={18} />
        )}
      </Button>
      {formError ? (
        <Text role="alert" className="mt-3 text-sm text-destructive">
          {formError}
        </Text>
      ) : null}
    </View>
  );
}
