import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Requerido")
  .email("Correo inválido")
  .max(320);

const passwordLoginSchema = z
  .string()
  .min(1, "Requerido")
  .max(128);

const passwordRegisterSchema = z
  .string()
  .min(8, "Mínimo 8 caracteres")
  .max(128);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordLoginSchema,
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "Requerido")
      .max(20, "Máximo 20 caracteres")
      .regex(/^\S+$/, "Sin espacios"),
    lastName: z
      .string()
      .trim()
      .min(1, "Requerido")
      .max(80, "Máximo 80 caracteres"),
    email: emailSchema,
    password: passwordRegisterSchema,
    confirmPassword: z.string().min(1, "Requerido"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
