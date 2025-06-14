import { z } from "zod";
import { BankAccountType } from "../../enums/BankAccountType.enum";

export const CreateBankAccountSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  type: z.nativeEnum(BankAccountType),
  balance: z
    .number()
    .finite("Saldo deve ser um número válido")
    .nonnegative("Saldo não pode ser negativo"),
});

export type CreateBankAccountDTO = z.infer<typeof CreateBankAccountSchema>;
