import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  iconName: z.string().max(50, "Ícone obrigatório")
});

export type CreateCategoryDTO = z.infer<typeof CreateCategorySchema>;
