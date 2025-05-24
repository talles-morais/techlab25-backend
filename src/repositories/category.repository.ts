import { Repository } from "typeorm";
import { Category } from "../entities/Category";
import { AppDataSource } from "../data-source";

export class CategoryRepository {
  private categoryRepository: Repository<Category>;

  constructor() {
    this.categoryRepository = AppDataSource.getRepository(Category);
  }

  async create(category: Category) {
    return await this.categoryRepository.save(category);
  }

  async getAll(userId: string) {
    return await this.categoryRepository.findBy({ user: { id: userId } });
  }

  async getById(userId: string, categoryId: string) {
    return await this.categoryRepository.findOne({
      where: { id: categoryId, user: { id: userId } },
      relations: ["user"],
    });
  }

  async update(userId: string, category: Category) {
    return await this.categoryRepository.save({
      id: category.id,
      user: { id: userId },
      name: category.name,
    });
  }
}
