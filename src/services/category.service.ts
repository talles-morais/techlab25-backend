import { CreateCategoryDTO } from "../dtos/category/create-category.dto";
import { Category } from "../entities/Category";
import { User } from "../entities/User";
import { CategoryRepository } from "../repositories/category.repository";

export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async createCategory(userId: string, categoryData: CreateCategoryDTO) {
    const user = new User();
    user.id = userId;

    const category = new Category();
    category.name = categoryData.name;
    category.user = user;

    const createdCategory = await this.categoryRepository.create(category);

    return createdCategory;
  }
}
