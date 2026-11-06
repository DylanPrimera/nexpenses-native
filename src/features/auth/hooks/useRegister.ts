import { queryKeys } from "@/core/query/query-keys";
import { useMutation } from "@tanstack/react-query";
import { authErrorMessage } from "../lib/auth-errors";
import type { RegisterFormValues } from "../schemas";
import { useAuthStore } from "../store";

export const useRegister = () => {
  const { register } = useAuthStore();
  const { mutateAsync, isPending, error } = useMutation({
    mutationKey: queryKeys.auth.register,
    mutationFn: ({ firstName, lastName, email, password }: RegisterFormValues) =>
      register({ firstName, lastName, email, password }),
  });

  const submit = async (values: RegisterFormValues) => {
    try {
      await mutateAsync(values);
      return true;
    } catch {
      return false;
    }
  };

  return { submit, isLoading: isPending, formError: error ? authErrorMessage(error) : null };
};
