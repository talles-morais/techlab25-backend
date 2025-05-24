import { Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";

export class UserRepository {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email })
  }

  async create(user: User) {
    return await this.userRepository.save(user)
  }
}