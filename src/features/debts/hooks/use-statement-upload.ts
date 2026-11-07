import type { CreditKind, Credit } from "@/core/types/domain";
import { isCancel } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCreateCreditFromStatement } from "./index";
import type { StatementFile } from "../lib/statement-file";

export type UploadPhase = "idle" | "upload" | "process";

type UploadInput = {
  kind: CreditKind;
  displayName: string;
  file: StatementFile;
  rateEa: number | null;
  rateMv: number | null;
};

export function useStatementUpload() {
  const { mutateAsync } = useCreateCreditFromStatement();
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [percent, setPercent] = useState(0);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const upload = useCallback(
    async (input: UploadInput): Promise<Credit | null> => {
      const controller = new AbortController();
      controllerRef.current = controller;
      setPercent(0);
      setPhase("upload");
      try {
        return await mutateAsync({
          ...input,
          signal: controller.signal,
          onUploadProgress: (next) => {
            setPercent(next);
            if (next >= 100) setPhase("process");
          },
        });
      } catch (error) {
        if (controller.signal.aborted || isCancel(error)) return null;
        throw error;
      } finally {
        if (!controller.signal.aborted) setPhase("idle");
      }
    },
    [mutateAsync],
  );

  return { phase, percent, upload };
}
