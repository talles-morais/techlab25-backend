import { Request, Response } from "express";
import { makeSutForCategoryController } from "../helpers/makeSutForCategoryController";
import { mockRequest, mockResponse } from "../helpers/mockUtils";
import { UpdateCategorySchema } from "../../src/dtos/category/update-category.dto";
import { HttpError } from "../../src/utils/http-error";
jest.mock("../../src/dtos/category/update-category.dto", () => ({
  UpdateCategorySchema: {
    parse: jest.fn(),
  },
}));

jest.mock("../../src/services/category.service");

describe("Category controller - update categories", () => {
  const { categoryController, categoryServiceMock } =
    makeSutForCategoryController();

  const userId = "user123";
  const categoryId = "550e8400-e29b-41d4-a716-446655440000";

  const categoryData = { name: "Nova Categoria" };
  const updatedCategory = { id: categoryId, name: "Nova Categoria" };

  beforeEach(() => {
    (UpdateCategorySchema.parse as jest.Mock).mockReturnValue(categoryData);
    jest.clearAllMocks();
  });

  it("should update a category and return status 200", async () => {
    categoryServiceMock.updateCategory.mockResolvedValue(updatedCategory);

    const req = mockRequest(categoryController) as Request;
    req.user = { id: userId };
    req.params = { id: categoryId };
    req.body = categoryData;

    const res = mockResponse() as Response;

    await categoryController.updateCategory(req, res);

    expect(UpdateCategorySchema.parse).toHaveBeenCalledWith(categoryData);
    expect(categoryServiceMock.updateCategory).toHaveBeenCalledWith(
      userId,
      categoryId,
      categoryData
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedCategory);
  });

  it("should handle HttpError(404) when category is not found", async () => {
    const error = new HttpError(404, "Categoria não encontrada.");
    categoryServiceMock.updateCategory.mockRejectedValue(error);

    const req = mockRequest(categoryController) as Request;
    req.user = { id: userId };
    req.params = { id: categoryId };
    req.body = categoryData;

    const res = mockResponse() as Response;

    await expect(categoryController.updateCategory(req, res)).rejects.toThrow(
      HttpError
    );

    expect(UpdateCategorySchema.parse).toHaveBeenCalledWith(categoryData);
    expect(categoryServiceMock.updateCategory).toHaveBeenCalledWith(
      userId,
      categoryId,
      categoryData
    );
  });
});
