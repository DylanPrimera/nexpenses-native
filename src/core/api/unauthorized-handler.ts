/**
 * 401 hook point. Toast UI lands in phase 1 (sonner-native);
 * auth store wires logout in phase 4. Register from app bootstrap.
 */

type UnauthorizedHandler = (message: string) => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;
}

export function notifyUnauthorized(message = "Sesión expirada") {
  unauthorizedHandler?.(message);
}
