import { Request, Response } from "express";
import { CategoryRepository } from "../repositories/category.repository";
import { CategoryService } from "../services/category.service";
import { CreateCategorySchema } from "../dtos/category/create-category.dto";

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    const categoryRepository = new CategoryRepository();
    this.categoryService = new CategoryService(categoryRepository);
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
}
