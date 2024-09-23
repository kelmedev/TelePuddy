// schemas/signInSchema.ts
import { z } from "zod";

export const signInSchema = z.object({
  email: z.string()
    .nonempty("O e-mail é obrigatório.")
    .email("Por favor, insira um e-mail válido."),
  password: z.string()
    .nonempty("A senha é obrigatória.")
    .min(6, "A senha deve ter pelo menos 6 caracteres.")
    .max(20, "A senha não pode exceder 20 caracteres."),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
