import { z } from "zod";
import { BankAccountTypeValues } from "../../enums/BankAccountType.enum";

export const CreateBankAccountSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  type: z.enum(BankAccountTypeValues),
  balance: z
    .number()
    .finite("Saldo deve ser um número válido")
    .nonnegative("Saldo não pode ser negativo"),
});

export type CreateBankAccountDTO = z.infer<typeof CreateBankAccountSchema>;
