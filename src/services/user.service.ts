import jwt from "jsonwebtoken";

import config from "../config/config";
import { CreateUserResponseDTO } from "../dtos/user/create-user-response.dto";
import { CreateUserDto } from "../dtos/user/create-user.dto";
import { LoginUserResponseDTO } from "../dtos/user/login-user-response.dto";
import { LoginUserDTO } from "../dtos/user/login-user.dto";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/user.repository";
import { hashPassword, verifyPassword } from "../utils/hash";
import { HttpError } from "../utils/http-error";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(userData: CreateUserDto): Promise<CreateUserResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new HttpError(409, "Usuário com e-mail já cadastrado.");
    }

    const user = new User();
    user.name = userData.name;
    user.email = userData.email;
    user.password = await hashPassword(userData.password);

    const createdUser = await this.userRepository.create(user);

    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
    };
  }

  async loginUser(loginData: LoginUserDTO): Promise<LoginUserResponseDTO> {
    const jwt_secret = config.jwt.secret;

    if (!jwt_secret) {
      throw new HttpError(500, "JWT_SECRET ausente.");
    }

    const existingUser = await this.userRepository.findByEmail(loginData.email);

    if (!existingUser) {
      throw new HttpError(404, "Usuário não encontrado.");
    }

    const isPasswordValid = await verifyPassword(
      existingUser.password,
      loginData.password
    );

    if (!isPasswordValid) {
      throw new HttpError(401, "Usuário ou senha incorretos.");
    }

    const token = jwt.sign({ id: existingUser.id }, jwt_secret);

    return { token, user: { id: existingUser.id } };
  }
}
