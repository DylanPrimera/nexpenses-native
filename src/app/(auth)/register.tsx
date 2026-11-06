import { AuthForm, useRegister } from "@/features/auth";

export default function RegisterScreen() {
  const { submit, isLoading } = useRegister();

  return (
    <AuthForm
      mode="register"
      loading={isLoading}
      onSubmit={async ({ fullName, email, password }) => {
        await submit(fullName, email, password);
      }}
    />
  );
}
