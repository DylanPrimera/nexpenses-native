import { AuthForm, useGoogleSignIn, useRegister } from "@/features/auth";

export default function RegisterScreen() {
  const { submit, isLoading, formError } = useRegister();
  const google = useGoogleSignIn();

  return (
    <AuthForm
      mode="register"
      loading={isLoading}
      formError={formError}
      googleLoading={google.isLoading}
      onGoogle={async () => {
        await google.submit();
      }}
      onSubmitLogin={async () => undefined}
      onSubmitRegister={async (values) => {
        await submit(values);
      }}
    />
  );
}
