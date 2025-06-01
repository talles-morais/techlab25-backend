import { Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "../../../src/utils/http-error";

import { mockRequest, mockResponse } from "../../controllers/helpers/mockUtils";
import { makeSutForUserController } from "../../controllers/helpers/makeSutForUserController";

jest.mock("../../../src/services/user.service");

describe("User controller - login (unit)", () => {
  const { userController, userServiceMock } = makeSutForUserController();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should set httpOnly cookie and return user data on successful login", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      password: "password123",
    };
    const mockToken = "mock.jwt.token";

    userServiceMock.loginUser = jest
      .fn()
      .mockResolvedValue({ token: mockToken, user: { id: mockUser.id } });

    const req = mockRequest(mockUser) as Request;
    const res = mockResponse() as Response;

    await userController.loginUser(req, res);

    expect(userServiceMock.loginUser).toHaveBeenCalledWith({
      email: mockUser.email,
      password: mockUser.password,
    });
    expect(res.cookie).toHaveBeenCalledWith(
      "token",
      mockToken,
      expect.objectContaining({
        httpOnly: true,
        secure: expect.any(Boolean),
        maxAge: expect.any(Number),
        sameSite: "lax",
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ user: { id: mockUser.id } });
  });

  it("should throw ZodError if body is invalid", async () => {
    const req = { body: { email: "invalid", password: "123" } } as Request;
    const res = {} as Response;

    await expect(userController.createUser(req, res)).rejects.toThrow(ZodError);

    expect(userServiceMock.loginUser).not.toHaveBeenCalled();
  });

  it("should throw HttpError if user dont exists", async () => {
    const userData = {
      email: "notfound@email.com",
      password: "Senha@123",
    };

    const error = new HttpError(404, "Usuário não encontrado.");

    userServiceMock.loginUser.mockRejectedValue(error);

    const req = mockRequest(userData);
    const res = mockResponse();

    await expect(
      userController.loginUser(req as any, res as any)
    ).rejects.toThrow(error);
  });
});
