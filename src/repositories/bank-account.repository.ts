import { Repository } from "typeorm";
import { BankAccount } from "../entities/BankAccount";
import { AppDataSource } from "../data-source";

export class BankAccountRepository {
  private bankAccountRepository: Repository<BankAccount>;

  constructor() {
    this.bankAccountRepository = AppDataSource.getRepository(BankAccount);
  }

  async create(bankAccount: BankAccount) {
    return await this.bankAccountRepository.save(bankAccount);
  }

  async getAll(userId: string) {
    return await this.bankAccountRepository.findBy({ user: { id: userId } });
  }
}
