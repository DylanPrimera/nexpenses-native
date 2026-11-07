import NetInfo from "@react-native-community/netinfo";
import { useSyncExternalStore } from "react";
import { setPhysicalConnectivity } from "@/core/query/session-runtime";

let ready = false;
let connected = false;
const listeners = new Set<() => void>();
function apply(state: Awaited<ReturnType<typeof NetInfo.fetch>>) {
  ready = true;
  connected = state.isConnected === true && state.isInternetReachable !== false;
  setPhysicalConnectivity(connected);
  listeners.forEach((listener) => listener());
}
NetInfo.addEventListener(apply);
void NetInfo.fetch()
  .then(apply)
  .catch(() => apply({ isConnected: false } as Awaited<ReturnType<typeof NetInfo.fetch>>));

export function useConnectivity() {
  useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    () => `${ready}:${connected}`,
  );
  return { isReady: ready, isOnline: ready && connected };
}
