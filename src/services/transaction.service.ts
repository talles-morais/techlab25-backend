import { DataSource } from "typeorm";
import { CreateTransactionDTO } from "../dtos/transaction/create-transaction.dto";
import { BankAccount } from "../entities/BankAccount";
import { Transaction } from "../entities/Transaction";
import { User } from "../entities/User";
import { BankAccountRepository } from "../repositories/bank-account.repository";
import { CategoryRepository } from "../repositories/category.repository";
import {
  PaginatedResult,
  PaginationOptions,
  TransactionRepository,
} from "../repositories/transaction.repository";
import { HttpError } from "../utils/http-error";
import { TransactionType } from "../enums/TransactionType.enum";

export interface GetTransactionsQuery {
  page?: number;
  limit?: number;
}

export class TransactionService {
  constructor(private dataSource: DataSource) {}

  async createTransaction(
    userId: string,
    transactionData: CreateTransactionDTO
  ) {
    const { fromAccountId, toAccountId, amount } = transactionData;

    if (fromAccountId === toAccountId) {
      throw new HttpError(
        400,
        "Não é permitido transferir valores para a mesma conta."
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transactionRepository = new TransactionRepository(
        queryRunner.manager
      );
      const bankAccountRepository = new BankAccountRepository(
        queryRunner.manager
      );
      const categoryRepository = new CategoryRepository(queryRunner.manager);

      const user = new User();
      user.id = userId;

      let fromAccount: BankAccount | null = null;
      let toAccount: BankAccount | null = null;

      if (fromAccountId) {
        fromAccount = await bankAccountRepository.getById(
          userId,
          fromAccountId
        );

        if (!fromAccount) {
          throw new HttpError(404, "Conta de origem não encontrada.");
        }

        if (fromAccount.balance < amount) {
          throw new HttpError(422, "Saldo insuficiente na conta de origem.");
        }

        fromAccount.balance -= amount;
        await bankAccountRepository.update(userId, fromAccount);
      }

      if (toAccountId) {
        toAccount = await bankAccountRepository.getById(userId, toAccountId);

        if (!toAccount) {
          throw new HttpError(404, "Conta de destino não encontrada.");
        }

        toAccount.balance += amount;
        await bankAccountRepository.update(userId, toAccount);
      }

      const category = await categoryRepository.getById(
        userId,
        transactionData.categoryId
      );

      if (!category) {
        throw new HttpError(404, "Categoria não encontrada.");
      }

      const transaction = new Transaction();
      transaction.user = user;
      transaction.fromAccount = fromAccount;
      transaction.toAccount = toAccount;
      transaction.amount = amount;
      transaction.description = transactionData.description;
      transaction.date = transactionData.date;
      transaction.type = TransactionType[transactionData.type];
      transaction.category = category;

      const createdTransaction = await transactionRepository.create(
        transaction
      );

      await queryRunner.commitTransaction();

      return createdTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpError(
        error.statusCode || 500,
        error.message || "Erro interno no servidor"
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getTransactions(
    userId: string,
    query: GetTransactionsQuery = {}
  ): Promise<PaginatedResult<Transaction>> {
    const MAX_LIMIT = 40;
    const { page = 1, limit = 10 } = query;

    if (page < 1) {
      throw new HttpError(400, "O número da página deve ser maior que 0.");
    }
    if (limit < 1 || limit > MAX_LIMIT) {
      throw new HttpError(400, `O limite deve estar entre 1 e ${MAX_LIMIT}`);
    }

    const entityManager = this.dataSource.manager;
    const transactionRepository = new TransactionRepository(entityManager);

    const paginationOptions: PaginationOptions = { page, limit };

    const transactions = await transactionRepository.findWithPagination(
      userId,
      paginationOptions
    );

    return transactions;
  }
}
