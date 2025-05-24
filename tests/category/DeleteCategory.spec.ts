import { Request, Response } from "express";
import { makeSutForCategoryController } from "../helpers/makeSutForCategoryController";
import { mockRequest, mockResponse } from "../helpers/mockUtils";
import { HttpError } from "../../src/utils/http-error";

jest.mock("../../src/services/category.service");

describe("Category controller - delete category", () => {
  const { categoryController, categoryServiceMock } = makeSutForCategoryController();

  const userId = "user123";
  const categoryId = "550e8400-e29b-41d4-a716-446655440000";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a category and return status 204", async () => {
    categoryServiceMock.deleteCategory.mockResolvedValue(undefined);

    const req = mockRequest(categoryController) as Request;
    req.user = { id: userId };
    req.params = { id: categoryId };

    const res = mockResponse() as Response;

    await categoryController.deleteCategory(req, res);

    expect(categoryServiceMock.deleteCategory).toHaveBeenCalledWith(
      userId,
      categoryId
    );
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  it("should handle HttpError(404) when category is not found", async () => {
    const error = new HttpError(404, "Categoria não encontrada.");
    categoryServiceMock.deleteCategory.mockRejectedValue(error);

    const req = mockRequest(categoryController) as Request;
    req.user = { id: userId };
    req.params = { id: categoryId };

    const res = mockResponse() as Response;

    await expect(categoryController.deleteCategory(req, res)).rejects.toThrow(
      HttpError
    );

    expect(categoryServiceMock.deleteCategory).toHaveBeenCalledWith(
      userId,
      categoryId
    );
  });

  it("should handle HttpError(403) when user has no permission", async () => {
    const error = new HttpError(403, "Você não tem permissão para deletar esta categoria.");
    categoryServiceMock.deleteCategory.mockRejectedValue(error);

    const req = mockRequest(categoryController) as Request;
    req.user = { id: userId };
    req.params = { id: categoryId };

    const res = mockResponse() as Response;

    await expect(categoryController.deleteCategory(req, res)).rejects.toThrow(
      HttpError
    );

    expect(categoryServiceMock.deleteCategory).toHaveBeenCalledWith(
      userId,
      categoryId
    );
  });
});