export interface ApiEnvelopeError {
  statusCode?: number;
  code?: string;
  details?: { field: string; message: string }[] | unknown;
}

export interface ApiEnvelope<T = unknown> {
  success?: boolean;
  data?: T;
  message?: string | string[];
  error?: ApiEnvelopeError;
}

export interface ApiResult<T> {
  data: T;
  message: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly statusCode: number;
  readonly code?: string;
  readonly details?: ApiEnvelopeError["details"];

  constructor(
    message: string,
    status: number,
    options?: { code?: string; details?: ApiEnvelopeError["details"] },
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusCode = status;
    this.code = options?.code;
    this.details = options?.details;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function messageFromUnknown(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim()) return value;
  if (Array.isArray(value)) return value.map(String).join(", ");
  return fallback;
}

export function peelEnvelope<T>(
  body: unknown,
  httpStatus: number,
  statusText = "",
): ApiResult<T> {
  if (httpStatus === 204) {
    return { data: undefined as T, message: "OK" };
  }

  const envelope =
    body && typeof body === "object" ? (body as ApiEnvelope<T>) : null;
  const fallback = statusText || `HTTP ${httpStatus}`;

  if (httpStatus >= 400) {
    throw new ApiError(
      messageFromUnknown(envelope?.message, fallback),
      httpStatus,
      {
        code:
          typeof envelope?.error?.code === "string"
            ? envelope.error.code
            : undefined,
        details: envelope?.error?.details ?? envelope ?? body,
      },
    );
  }

  if (envelope && typeof envelope.success === "boolean") {
    if (envelope.success === false) {
      throw new ApiError(
        messageFromUnknown(envelope.message, fallback),
        envelope.error?.statusCode ?? httpStatus,
        {
          code:
            typeof envelope.error?.code === "string"
              ? envelope.error.code
              : undefined,
          details: envelope.error?.details ?? envelope,
        },
      );
    }
    return {
      data: (envelope.data === undefined ? null : envelope.data) as T,
      message: typeof envelope.message === "string" ? envelope.message : "OK",
    };
  }

  return {
    data: (body === null || body === undefined ? undefined : body) as T,
    message: "OK",
  };
}
