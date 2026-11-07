import { queryKeys } from "@/core/query/query-keys";
import { notifyError, notifyWarning } from "@/shared/toast/notify";
import { useMutation } from "@tanstack/react-query";
import { googleFeedback } from "../lib/google-errors";
import { useAuthStore } from "../store";

export const useGoogleSignIn = () => {
  const { loginWithGoogle } = useAuthStore();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: queryKeys.auth.google,
    mutationFn: loginWithGoogle,
  });

  const submit = async () => {
    try {
      return (await mutateAsync()) === "signed-in";
    } catch (error) {
      const feedback = googleFeedback(error);
      if (feedback?.level === "warning") notifyWarning(feedback.message);
      else if (feedback) notifyError(feedback.message);
      return false;
    }
  };

  return { submit, isLoading: isPending };
};
