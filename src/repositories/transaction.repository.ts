import { EntityManager, Repository } from "typeorm";
import { Transaction } from "../entities/Transaction";

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export class TransactionRepository {
  private transactionRepository: Repository<Transaction>;

  constructor(entityManager: EntityManager) {
    this.transactionRepository = entityManager.getRepository(Transaction);
  }

  async create(transactionData: Transaction) {
    return await this.transactionRepository.save(transactionData);
  }

  async findWithPagination(
    userId: string,
    options: PaginationOptions
  ): Promise<PaginatedResult<Transaction>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await this.transactionRepository.findAndCount({
      where: { user: { id: userId } },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  async findAll(userId: string): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: { user: { id: userId } },
    });
  }
}
