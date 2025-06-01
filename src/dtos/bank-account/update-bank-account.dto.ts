import { z } from "zod";
import { BankAccountType } from "../../enums/BankAccountType.enum";

export const UpdateBankAccountSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").optional(),
  type: z.nativeEnum(BankAccountType).optional(),
  balance: z
    .number({ invalid_type_error: "Valor deve ser um número" })
    .finite("Valor deve ser um número válido")
    .nonnegative("Valor do saldo não pode ser negativo")
    .optional(),
});

export type UpdateBankAccountDTO = z.infer<typeof UpdateBankAccountSchema>;
