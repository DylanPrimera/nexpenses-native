import { AuthForm, useLogin } from "@/features/auth";

export default function LoginScreen() {
  const { submit, isLoading, formError } = useLogin();

  return (
    <AuthForm
      mode="login"
      loading={isLoading}
      formError={formError}
      onSubmitLogin={async (values) => {
        await submit(values);
      }}
      onSubmitRegister={async () => undefined}
    />
  );
}
