import { CreateCategoryDTO } from "../dtos/category/create-category.dto";
import { UpdateCategoryDTO } from "../dtos/category/update-category.dto";
import { Category } from "../entities/Category";
import { User } from "../entities/User";
import { CategoryRepository } from "../repositories/category.repository";
import { HttpError } from "../utils/http-error";

export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async createCategory(userId: string, categoryData: CreateCategoryDTO) {
    const user = new User();
    user.id = userId;

    const category = new Category();
    category.name = categoryData.name;
    category.user = user;
    category.iconName = categoryData.iconName;

    const createdCategory = await this.categoryRepository.create(category);

    return createdCategory;
  }

  async getAllCategories(userId: string) {
    const categories = await this.categoryRepository.getAll(userId);

    return categories;
  }

  async updateCategory(
    userId: string,
    categoryId: string,
    categoryData: UpdateCategoryDTO
  ) {
    const categoryExists = await this.categoryRepository.getById(
      userId,
      categoryId
    );

    if (!categoryExists) {
      throw new HttpError(404, "Categoria não encontrada.");
    }

    if (categoryExists.user.id !== userId) {
      throw new HttpError(
        403,
        "Você não tem permissão para atualizar esta categoria."
      );
    }

    categoryExists.name = categoryData.name;

    const updatedCategory = await this.categoryRepository.update(
      userId,
      categoryExists
    );

    return updatedCategory;
  }

  async deleteCategory(userId: string, categoryId: string) {
    const categoryExists = await this.categoryRepository.getById(
      userId,
      categoryId
    );

    if (!categoryExists) {
      throw new HttpError(404, "Categoria não encontrada.");
    }

    if (categoryExists.user.id !== userId) {
      throw new HttpError(
        403,
        "Você não tem permissão para deletar esta categoria."
      );
    }

    await this.categoryRepository.delete(userId, categoryExists.id);
  }
}
