import { z } from "zod";

export const UpdateCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

export type UpdateCategoryDTO = z.infer<typeof UpdateCategorySchema>;
