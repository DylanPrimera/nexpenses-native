import { AuthForm, useGoogleSignIn, useLogin } from "@/features/auth";

export default function LoginScreen() {
  const { submit, isLoading, formError } = useLogin();
  const google = useGoogleSignIn();

  return (
    <AuthForm
      mode="login"
      loading={isLoading}
      formError={formError}
      googleLoading={google.isLoading}
      onGoogle={async () => {
        await google.submit();
      }}
      onSubmitLogin={async (values) => {
        await submit(values);
      }}
      onSubmitRegister={async () => undefined}
    />
  );
}
