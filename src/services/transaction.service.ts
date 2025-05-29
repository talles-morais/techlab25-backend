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
import { UpdateTransactionDTO } from "../dtos/transaction/update-transaction.dto";

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

  async getAllTransactions(userId: string) {
    const entityManager = this.dataSource.manager;
    const transactionRepository = new TransactionRepository(entityManager);

    const transactions = await transactionRepository.findAll(userId);

    return transactions;
  }

  async updateTransaction(
    userId: string,
    transactionId: string,
    transactionData: UpdateTransactionDTO
  ) {
    const { fromAccountId, toAccountId, amount } = transactionData;

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

      const transactionExists = await transactionRepository.findById(
        userId,
        transactionId
      );

      if (!transactionExists) {
        throw new HttpError(404, "Transação não encontrada.");
      }

      if (fromAccountId === toAccountId) {
        throw new HttpError(
          400,
          "Não é permitido transferir valores para a mesma conta."
        );
      }

      const user = new User();
      user.id = userId;

      let updatedFromAccount = transactionExists.fromAccount;

      // Processa a conta de origem
      if (fromAccountId) {
        if (
          transactionExists.fromAccount &&
          transactionExists.fromAccount.id === fromAccountId
        ) {
          // Mesma conta de origem - apenas ajusta para o novo valor
          const currentFromAccount = await bankAccountRepository.getById(
            userId,
            fromAccountId
          );

          if (!currentFromAccount) {
            throw new HttpError(404, "Conta de origem não encontrada.");
          }

          // Restaura o saldo e aplica o novo valor
          const restoredBalance =
            currentFromAccount.balance + transactionExists.amount;

          if (restoredBalance < amount) {
            throw new HttpError(422, "Saldo insuficiente na conta de origem.");
          }

          currentFromAccount.balance = restoredBalance - amount;
          await bankAccountRepository.update(userId, currentFromAccount);
          updatedFromAccount = currentFromAccount;
        } else {
          // Conta de origem diferente - restaura a antiga e debita da nova

          // Restaura a conta de origem original
          if (transactionExists.fromAccount) {
            const oldFromAccount = await bankAccountRepository.getById(
              userId,
              transactionExists.fromAccount.id
            );

            if (oldFromAccount) {
              oldFromAccount.balance += transactionExists.amount;
              await bankAccountRepository.update(userId, oldFromAccount);
            }
          }

          // Debita da nova conta de origem
          const newFromAccount = await bankAccountRepository.getById(
            userId,
            fromAccountId
          );

          if (!newFromAccount) {
            throw new HttpError(404, "Conta de origem não encontrada.");
          }

          if (newFromAccount.balance < amount) {
            throw new HttpError(
              422,
              "Saldo insuficiente na nova conta de origem."
            );
          }

          newFromAccount.balance -= amount;
          await bankAccountRepository.update(userId, newFromAccount);
          updatedFromAccount = newFromAccount;
        }
      }

      let updatedToAccount = transactionExists.toAccount;

      // Processa a conta de destino
      if (toAccountId) {
        if (
          transactionExists.toAccount &&
          transactionExists.toAccount.id === toAccountId
        ) {
          // Mesma conta de destino - ajusta para o novo valor
          const currentToAccount = await bankAccountRepository.getById(
            userId,
            toAccountId
          );

          if (!currentToAccount) {
            throw new HttpError(404, "Conta de destino não encontrada.");
          }

          // Remove o valor antigo e adiciona o novo valor
          currentToAccount.balance =
            currentToAccount.balance - transactionExists.amount + amount;
          await bankAccountRepository.update(userId, currentToAccount);
          updatedToAccount = currentToAccount;
        } else {
          // Conta de destino diferente - remove da antiga e adiciona na nova

          // Remove da conta de destino original
          if (transactionExists.toAccount) {
            const oldToAccount = await bankAccountRepository.getById(
              userId,
              transactionExists.toAccount.id
            );

            if (oldToAccount) {
              oldToAccount.balance -= transactionExists.amount;
              await bankAccountRepository.update(userId, oldToAccount);
            }
          }

          // Adiciona na nova conta de destino
          const newToAccount = await bankAccountRepository.getById(
            userId,
            toAccountId
          );

          if (!newToAccount) {
            throw new HttpError(404, "Conta de destino não encontrada.");
          }

          newToAccount.balance += amount;
          await bankAccountRepository.update(userId, newToAccount);
          updatedToAccount = newToAccount;
        }
      }

      // Atualiza a categoria se necessário
      if (transactionExists.category.id !== transactionData.categoryId) {
        const newCategory = await categoryRepository.getById(
          userId,
          transactionData.categoryId
        );
        if (!newCategory) {
          throw new HttpError(404, "Categoria não encontrada.");
        }
        transactionExists.category = newCategory;
      }

      const transaction = new Transaction();
      transaction.id = transactionId;
      transaction.user = user;
      transaction.fromAccount = updatedFromAccount;
      transaction.toAccount = updatedToAccount;
      transaction.amount = amount;
      transaction.description = transactionData.description;
      transaction.date = transactionData.date;
      transaction.type = TransactionType[transactionData.type];
      transaction.category = transactionExists.category;

      const createdTransaction = await transactionRepository.update(
        userId,
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

  async deleteTransaction(userId: string, transactionId: string) {
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

      const transactionExists = await transactionRepository.findById(
        userId,
        transactionId
      );

      if (!transactionExists) {
        throw new HttpError(404, "Transação não encontrada.");
      }

      const user = new User();
      user.id = userId;

      if (transactionExists.fromAccount) {
        const fromAccountId = transactionExists.fromAccount.id;
        const fromAccount = await bankAccountRepository.getById(
          userId,
          fromAccountId
        );
        fromAccount.balance += transactionExists.amount;
        await bankAccountRepository.update(userId, fromAccount);
      }

      if (transactionExists.toAccount) {
        const toAccountId = transactionExists.toAccount.id;
        const toAccount = await bankAccountRepository.getById(
          userId,
          toAccountId
        );
        toAccount.balance -= transactionExists.amount;
        await bankAccountRepository.update(userId, toAccount);
      }

      await transactionRepository.delete(userId, transactionId);

      await queryRunner.commitTransaction();
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
}
