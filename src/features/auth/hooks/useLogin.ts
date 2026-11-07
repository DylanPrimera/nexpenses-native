import { queryKeys } from "@/core/query/query-keys";
import { useMutation } from "@tanstack/react-query";
import { authErrorMessage } from "../lib/auth-errors";
import type { LoginFormValues } from "../schemas";
import { useAuthStore } from "../store";

export const useLogin = () => {
  const { login } = useAuthStore();
  const { mutateAsync, isPending, error } = useMutation({
    networkMode: "always",
    retry: false,
    mutationKey: queryKeys.auth.login,
    mutationFn: ({ email, password }: LoginFormValues) => login(email, password),
  });

  const submit = async (values: LoginFormValues) => {
    try {
      await mutateAsync(values);
      return true;
    } catch {
      return false;
    }
  };

  return { submit, isLoading: isPending, formError: error ? authErrorMessage(error) : null };
};
