import { Request, Response } from "express";

import { makeSutForCategoryController } from "../helpers/makeSutForCategoryController";
import { mockRequest, mockResponse } from "../helpers/mockUtils";
import { CreateCategorySchema } from "../../../src/dtos/category/create-category.dto";
import { ZodError } from "zod";

jest.mock("../../../src/dtos/category/create-category.dto", () => ({
  CreateCategorySchema: {
    parse: jest.fn(),
  },
}));

jest.mock("../../../src/services/category.service");

describe("Category controller - create category", () => {
  const { categoryController, categoryServiceMock } =
    makeSutForCategoryController();

  const categoryData = { name: "Alimentação" };
  const createdCategory = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Alimentação",
    user: {
      id: "user123",
      name: "Test User",
      email: "test@example.com",
      password: "hashedpassword",
      bankAccounts: [],
      categories: [],
      transactions: [],
      creditCards: [],
      scheduledTransactons: [],
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    },
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  };

  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();

    (CreateCategorySchema.parse as jest.Mock).mockReturnValue(categoryData);
    categoryServiceMock.createCategory.mockResolvedValue(createdCategory);

    req = mockRequest(categoryController) as Partial<Request>;
    req.body = categoryData;
    req.user = { id: "user123" };

    res = mockResponse() as Partial<Response>;
  });

  it("should create a category and return status 201", async () => {
    await categoryController.createCategory(req as Request, res as Response);

    expect(CreateCategorySchema.parse).toHaveBeenCalledWith(categoryData);
    expect(categoryServiceMock.createCategory).toHaveBeenCalledWith(
      "user123",
      categoryData
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdCategory);
  });

  it("should throw ZodError if body is invalid", async () => {
    const invalidData = { name: "" };

    (CreateCategorySchema.parse as jest.Mock).mockImplementation(() => {
      throw new ZodError([]);
    });

    req = mockRequest(categoryController) as Partial<Request>;
    req.body = invalidData;
    req.user = { id: "user123" };

    res = mockResponse() as Partial<Response>;

    await expect(
      categoryController.createCategory(req as Request, res as Response)
    ).rejects.toThrow(ZodError);

    expect(categoryServiceMock.createCategory).not.toHaveBeenCalled();
  });
});
