import { useState } from "react";
import { AuthActionError } from "../actions";
import { authCopy } from "../lib/auth-messages";
import type { RegisterFormValues } from "../schemas";
import { useAuthStore } from "../store";

export const useRegister = () => {
  const { register } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setFormError(null);
    try {
      await register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });
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
