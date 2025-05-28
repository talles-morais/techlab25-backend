import { Request, Response } from "express";
import { makeSutForCategoryController } from "../helpers/makeSutForCategoryController";
import { mockRequest, mockResponse } from "../helpers/mockUtils";;

jest.mock("../../src/dtos/category/update-category.dto", () => ({
  UpdateCategorySchema: {
    parse: jest.fn(),
  },
}));

jest.mock("../../src/services/category.service");

describe("Category controller - get all categories", () => {
  const { categoryController, categoryServiceMock } =
    makeSutForCategoryController();

  const userId = "user123";
  const categoryId = "550e8400-e29b-41d4-a716-446655440000";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return all categories with status 200", async () => {
    const categories = [
      { id: categoryId, name: "Alimentação" },
      { id: "another-id", name: "Transporte" },
    ];

    categoryServiceMock.getAllCategories.mockResolvedValue(categories);

    const req = mockRequest(categoryController) as Request;
    req.user = { id: userId };
    const res = mockResponse() as Response;

    await categoryController.getAllCategories(req, res);

    expect(categoryServiceMock.getAllCategories).toHaveBeenCalledWith(userId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(categories);
  });
});
