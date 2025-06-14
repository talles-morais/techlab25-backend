import { EntityManager, Repository } from "typeorm";
import { BankAccount } from "../entities/BankAccount";
import { AppDataSource } from "../data-source";

export class BankAccountRepository {
  private bankAccountRepository: Repository<BankAccount>;

  constructor(entityManager: EntityManager) {
    this.bankAccountRepository = entityManager.getRepository(BankAccount);
  }

  async create(bankAccount: BankAccount) {
    return await this.bankAccountRepository.save(bankAccount);
  }

  async getAll(userId: string) {
    return await this.bankAccountRepository.findBy({ user: { id: userId } });
  }

  async getById(userId: string, bankAccountId: string) {
    return await this.bankAccountRepository.findOne({
      where: { id: bankAccountId, user: { id: userId } },
      relations: ["user"],
    });
  }

  async update(userId: string, bankAccount: BankAccount) {
    return await this.bankAccountRepository.save({
      id: bankAccount.id,
      name: bankAccount.name,
      type: bankAccount.type,
      balance: bankAccount.balance,
      user: { id: userId },
    });
  }

  async delete(userId: string, bankAccountId: string) {
    return await this.bankAccountRepository.delete({
      id: bankAccountId,
      user: { id: userId },
    });
  }

  async getTotalBalance(userId: string): Promise<number> {
    const result = await this.bankAccountRepository
      .createQueryBuilder("bankAccount")
      .select("SUM(bankAccount.balance)", "total")
      .where("bankAccount.userId = :userId", { userId })
      .getRawOne();

    return Number(result.total) || 0;
  }
}
