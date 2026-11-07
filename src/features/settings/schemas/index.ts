import { z } from "zod";

export const DELETE_CONFIRMATION_WORD = "ELIMINAR";

export const deleteAccountSchema = z.object({
  confirmation: z.string().refine((value) => value.trim() === DELETE_CONFIRMATION_WORD),
});

export type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;
