import { z } from "zod";
import { TransactionTypeValues } from "../../enums/TransactionType.enum";

export const UpdateTransactionSchema = z.object({
  fromAccountId: z
    .string()
    .uuid({ message: "Conta de origem inválida" })
    .optional()
    .nullable(),

  toAccountId: z
    .string()
    .uuid({ message: "Conta de destino inválida" })
    .optional()
    .nullable(),

  creditCardId: z
    .string()
    .uuid({ message: "Cartão de crédito inválido" })
    .optional()
    .nullable(),

  invoiceId: z
    .string()
    .uuid({ message: "Fatura inválida" })
    .optional()
    .nullable(),

  categoryId: z.string().uuid({ message: "Categoria inválida" }),

  amount: z
    .number({ invalid_type_error: "Valor deve ser um número" })
    .finite("Valor deve ser um número válido")
    .positive("Valor da transação deve ser positivo"),

  description: z.string().trim().min(1, "Descrição é obrigatória"),

  date: z.coerce.date({ invalid_type_error: "Data inválida" }),

  type: z.enum(TransactionTypeValues),
});

export type UpdateTransactionDTO = z.infer<typeof UpdateTransactionSchema>;
