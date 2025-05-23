import { CreateUserResponseDTO } from "../dtos/user/create-user-response.dto";
import { CreateUserDto } from "../dtos/user/create-user.dto";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/user.repository";
import { hashPassword } from "../utils/hash";
import { HttpError } from "../utils/http-error";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(userData: CreateUserDto): Promise<CreateUserResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new HttpError(409, "Usuário já existe.");
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
}
