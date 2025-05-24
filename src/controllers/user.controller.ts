import { Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { CreateUserSchema } from "../dtos/user/create-user.dto";
import { LoginUserSchema } from "../dtos/user/login-user.dto";
import config from "../config/config";

export class UserController {
  private userService: UserService;

  constructor() {
    const userRepository = new UserRepository();
    this.userService = new UserService(userRepository);
  }

  createUser = async (req: Request, res: Response) => {
    const userData = CreateUserSchema.parse(req.body);

    const user = await this.userService.createUser(userData);
    res.status(201).json(user);
  };

  loginUser = async (req: Request, res: Response) => {
    const loginData = LoginUserSchema.parse(req.body);

    const loginResponse = await this.userService.loginUser(loginData);

    res.cookie("token", loginResponse.token, {
      httpOnly: true,
      secure: config.env === "production",
      maxAge: 1000 * 60 * 60 * 2, // expira em 2h
      sameSite: config.env === "production" ? "none" : "lax",
    });

    res.status(200).json({ user: loginResponse.user });
  };
}
