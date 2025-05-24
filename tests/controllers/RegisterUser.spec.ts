import { Request, Response } from "express";
import { UserController } from "../../src/controllers/user.controller";
import { UserService } from "../../src/services/user.service";
import { CreateUserResponseDTO } from "../../src/dtos/user/create-user-response.dto";
import { HttpError } from "../../src/utils/http-error";
import { ZodError } from "zod";

jest.mock("../../src/services/user.service");

describe("User controller - create user", () => {
  let userController: UserController;
  let userServiceMock: jest.Mocked<UserService>;

  const mockRequest = (body = {}): Partial<Request> => ({ body });
  const mockResponse = () => {
    const res = {} as Partial<Response>;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    userController = new UserController();
    userServiceMock = (userController as any).userService;
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

    const error = new HttpError(409, "Usuário já existe.");

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
