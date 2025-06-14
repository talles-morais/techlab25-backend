import { Request, Response } from "express";
import { ZodError } from "zod";
import { CreateUserResponseDTO } from "../../../src/dtos/user/create-user-response.dto";
import { HttpError } from "../../../src/utils/http-error";

import { mockRequest, mockResponse } from "../../controllers/helpers/mockUtils";
import { makeSutForUserController } from "../../controllers/helpers/makeSutForUserController";

jest.mock("../../../src/services/user.service");

describe("User controller - create user", () => {
  const { userController, userServiceMock } = makeSutForUserController()

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a user and return status 201", async () => {
    const userData = {
      name: "João Silva",
      email: "joao@email.com",
      password: "Senha@123",
    };

    const createdUser: CreateUserResponseDTO = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "João Silva",
      email: "joao@email.com",
    };

    userServiceMock.createUser = jest.fn().mockResolvedValue(createdUser);

    const req = mockRequest(userData) as Request;
    const res = mockResponse() as Response;

    await userController.createUser(req, res);

    expect(userServiceMock.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      })
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdUser);
  });

  it("should throw HttpError if user already exists", async () => {
    const userData = {
      name: "João Silva",
      email: "joao@email.com",
      password: "Senha@123",
    };

    const error = new HttpError(409, "Usuário já cadastrado.");

    userServiceMock.createUser.mockRejectedValue(error);

    const req = mockRequest(userData);
    const res = mockResponse();

    await expect(
      userController.createUser(req as any, res as any)
    ).rejects.toThrow(error);
  });

  it("should throw ZodError if body is invalid", async () => {
    const req = { body: { name: "", email: "invalid", password: "123" } } as Request;
    const res = {} as Response;

    await expect(userController.createUser(req, res))
      .rejects
      .toThrow(ZodError);

    expect(userServiceMock.createUser).not.toHaveBeenCalled();
  });
});
