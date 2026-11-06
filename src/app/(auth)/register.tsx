import { AuthForm, useRegister } from "@/features/auth";

export default function RegisterScreen() {
  const { submit, isLoading, formError } = useRegister();

  return (
    <AuthForm
      mode="register"
      loading={isLoading}
      formError={formError}
      onSubmitLogin={async () => undefined}
      onSubmitRegister={async (values) => {
        await submit(values);
      }}
    />
  );
}
