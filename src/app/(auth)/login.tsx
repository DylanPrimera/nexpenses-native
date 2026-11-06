import { AuthForm, useLogin } from "@/features/auth";

export default function LoginScreen() {
  const { submit, isLoading } = useLogin();

  return (
    <AuthForm
      mode="login"
      loading={isLoading}
      onSubmit={async ({ email, password }) => {
        await submit(email, password);
      }}
    />
  );
}
