import { useState } from "react";
import { AuthActionError } from "../actions";
import { authCopy } from "../lib/auth-messages";
import type { LoginFormValues } from "../schemas";
import { useAuthStore } from "../store";

export const useLogin = () => {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setFormError(null);
    try {
      await login(values.email, values.password);
      return true;
    } catch (error) {
      setFormError(
        error instanceof AuthActionError
          ? error.message
          : authCopy.generic_error,
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, isLoading, formError };
};
