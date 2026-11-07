import { useConnectivity } from "@/core/network/connectivity";
import { Text } from "@/shared/components/ui/text";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { QueryClientProvider, useIsRestoring } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { registerExpenseMutation } from "@/features/expenses/lib/register-expense-mutation";
import { notifyError } from "@/shared/toast/notify";
import { messages } from "@/shared/i18n";
import { queryClient } from "./query-client";
import { getSessionPersistence } from "./query-persistence";
import { getQuerySession, setQueryNetworkReady } from "./session-runtime";

registerExpenseMutation(queryClient);

function RestoreGate({ ready, children }: { ready: boolean; children: ReactNode }) {
  const restoring = useIsRestoring();
  return ready && !restoring ? children : null;
}
function AuthenticatedQueries({ userId, children }: { userId: string; children: ReactNode }) {
  const persistence = useMemo(() => getSessionPersistence(userId, queryClient), [userId]);
  const [ready, setReady] = useState(false);
  async function restore() {
    try {
      await persistence.restore();
    } catch {
      if (persistence.active()) notifyError(messages.Offline.recovery_failure);
    }
    if (!persistence.active()) return;
    setReady(true);
    setQueryNetworkReady(true);
    void queryClient.resumePausedMutations();
  }
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={persistence.options}
      onSuccess={() => {
        void restore();
      }}
      onError={() => {
        void restore();
      }}
    >
      <RestoreGate ready={ready}>{children}</RestoreGate>
    </PersistQueryClientProvider>
  );
}
export function AppQueryProvider({ children }: { children: ReactNode }) {
  const { status, userId, refreshSession } = useAuthStore();
  const { isOnline } = useConnectivity();
  useEffect(() => {
    if (status === "authenticated" && !userId && isOnline) void refreshSession();
  }, [status, userId, isOnline, refreshSession]);
  useEffect(() => {
    if (status === "unauthenticated") setQueryNetworkReady(true);
    return () => {
      if (!getQuerySession().userId) setQueryNetworkReady(false);
    };
  }, [status]);
  if (status === "checking") return null;
  if (status === "authenticated" && userId)
    return (
      <AuthenticatedQueries key={userId} userId={userId}>
        {children}
      </AuthenticatedQueries>
    );
  return (
    <QueryClientProvider client={queryClient}>
      {status === "authenticated" && !userId ? (
        <Text className="p-6">{messages.Offline.recover_session}</Text>
      ) : (
        children
      )}
    </QueryClientProvider>
  );
}
