import { Request, Response } from "express";
import { CategoryRepository } from "../repositories/category.repository";
import { CategoryService } from "../services/category.service";
import { CreateCategorySchema } from "../dtos/category/create-category.dto";
import { UpdateCategorySchema } from "../dtos/category/update-category.dto";
import { AppDataSource } from "../data-source";

export class CategoryController {
  private categoryService: CategoryService;

  constructor(categoryService?: CategoryService) {
    if (categoryService) {
      this.categoryService = categoryService;
    } else {
      const entityManager = AppDataSource.manager;
      const categoryRepository = new CategoryRepository(entityManager);
      this.categoryService = new CategoryService(categoryRepository);
    }
  }

  createCategory = async (req: Request, res: Response) => {
    const categoryData = CreateCategorySchema.parse(req.body);

    const category = await this.categoryService.createCategory(
      req.user.id,
      categoryData
    );
    res.status(201).json(category);
  };

  getAllCategories = async (req: Request, res: Response) => {
    const categories = await this.categoryService.getAllCategories(req.user.id);
    res.status(200).json(categories);
  };

  updateCategory = async (req: Request, res: Response) => {
    const categoryId = req.params.id;
    const categoryData = UpdateCategorySchema.parse(req.body);

    const category = await this.categoryService.updateCategory(
      req.user.id,
      categoryId,
      categoryData
    );
    res.status(200).json(category);
  };

  deleteCategory = async (req: Request, res: Response) => {
    const categoryId = req.params.id;

    await this.categoryService.deleteCategory(req.user.id, categoryId);

    res.sendStatus(204);
  };
}
