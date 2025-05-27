import { EntityManager, Repository } from "typeorm";
import { Transaction } from "../entities/Transaction";

export class TransactionRepository {
  private transactionRepository: Repository<Transaction>;

  constructor(entityManager: EntityManager) {
    this.transactionRepository = entityManager.getRepository(Transaction)
  }

  async create(transactionData: Transaction) {
    return await this.transactionRepository.save(transactionData);
  }
}
