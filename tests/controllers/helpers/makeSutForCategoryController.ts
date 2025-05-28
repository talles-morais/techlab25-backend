import { CategoryController } from "../../../src/controllers/category.controller";
import { CategoryService } from "../../../src/services/category.service";

export function makeSutForCategoryController() {
  const categoryServiceMock = {
    createCategory: jest.fn(),
    getAllCategories: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn()
  };
  const categoryController = new CategoryController(categoryServiceMock as any);

  jest.clearAllMocks();

  return { categoryController, categoryServiceMock };
}
