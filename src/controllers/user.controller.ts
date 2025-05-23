import { Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { CreateUserSchema } from "../dtos/user/create-user.dto";

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
  }
}
