import { CreateTransactionDTO } from "../../../src/dtos/transaction/create-transaction.dto";
import {
  TransactionType,
  TransactionTypeValues,
} from "../../../src/enums/TransactionType.enum";
import { HttpError } from "../../../src/utils/http-error";
import {
  clearAllMocks,
  makeSutForTransactionService,
} from "../helpers/makeSutForTransactionService";

describe("Transaction service - Create Transaction", () => {
  const userId = "user-123";
  const fromAccountId = "account-1";
  const toAccountId = "account-2";
  const categoryId = "category-1";
  const transactionAmount = 100;

  let sut,
    queryRunnerMock,
    bankAccountRepositoryMock,
    categoryRepositoryMock,
    transactionRepositoryMock;

  beforeEach(() => {
    const sutSetup = makeSutForTransactionService();
    sut = sutSetup.sut;
    queryRunnerMock = sutSetup.queryRunnerMock;
    bankAccountRepositoryMock = sutSetup.bankAccountRepositoryMock;
    categoryRepositoryMock = sutSetup.categoryRepositoryMock;
    transactionRepositoryMock = sutSetup.transactionRepositoryMock;

    clearAllMocks();
  });

  it("should succesfully create a transaction", async () => {
    const transactionData: CreateTransactionDTO = {
      fromAccountId,
      toAccountId,
      amount: transactionAmount,
      date: new Date(),
      type: TransactionTypeValues[TransactionType.EXPENSE],
      categoryId,
    };

    const fromAccount = { id: fromAccountId, balance: 500 };
    const toAccount = { id: toAccountId, balance: 200 };
    const category = { id: categoryId };
    const createdTransaction = { id: "transaction-1" };

    bankAccountRepositoryMock.getById
      .mockResolvedValueOnce(fromAccount)
      .mockResolvedValueOnce(toAccount);
    categoryRepositoryMock.getById.mockResolvedValue(category);
    transactionRepositoryMock.create.mockResolvedValue(createdTransaction);

    const result = await sut.createTransaction(userId, transactionData);

    expect(queryRunnerMock.startTransaction).toHaveBeenCalled();
    expect(bankAccountRepositoryMock.update).toHaveBeenCalledTimes(2);
    expect(transactionRepositoryMock.create).toHaveBeenCalled();
    expect(queryRunnerMock.commitTransaction).toHaveBeenCalled();
    expect(result).toEqual(createdTransaction);
    expect(queryRunnerMock.release).toHaveBeenCalled();
  });

  it("should throw an error when transferring to the same account", async () => {
    const transactionData: CreateTransactionDTO = {
      fromAccountId: fromAccountId,
      toAccountId: fromAccountId,
      amount: transactionAmount,
      description: "Invalid transaction",
      date: new Date(),
      type: TransactionTypeValues[TransactionType.EXPENSE],
      categoryId: categoryId,
    };

    await expect(
      sut.createTransaction(userId, transactionData)
    ).rejects.toThrow(HttpError);

    expect(queryRunnerMock.startTransaction).not.toHaveBeenCalled();
  });

  it("should throw an error if fromAccount is not found", async () => {
    const transactionData: CreateTransactionDTO = {
      fromAccountId: fromAccountId,
      amount: transactionAmount,
      description: "No fromAccount",
      date: new Date(),
      type: TransactionTypeValues[TransactionType.EXPENSE],
      categoryId: categoryId,
    };

    bankAccountRepositoryMock.getById.mockResolvedValueOnce(null);

    categoryRepositoryMock.getById.mockResolvedValue({ id: categoryId });
    transactionRepositoryMock.create.mockResolvedValue({
      id: "transaction-123",
    });

    await expect(
      sut.createTransaction(userId, transactionData)
    ).rejects.toThrow(HttpError);

    expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunnerMock.release).toHaveBeenCalled();
  });

  it("should rollback transaction on unexpected error", async () => {
    const transactionData: CreateTransactionDTO = {
      fromAccountId: fromAccountId,
      amount: transactionAmount,
      description: "Unexpected error",
      date: new Date(),
      type: TransactionTypeValues[TransactionType.EXPENSE],
      categoryId: categoryId,
    };

    const fromAccount = { id: fromAccountId, balance: 500 };
    const toAccount = { id: toAccountId, balance: 300 };
    const category = { id: categoryId };

    bankAccountRepositoryMock.getById
      .mockResolvedValueOnce(fromAccount)
      .mockResolvedValueOnce(toAccount);

    categoryRepositoryMock.getById.mockResolvedValue(category);

    transactionRepositoryMock.create.mockRejectedValueOnce(
      new Error("Unexpected DB error")
    );

    await expect(
      sut.createTransaction(userId, transactionData)
    ).rejects.toThrow(HttpError);

    expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunnerMock.release).toHaveBeenCalled();
  });

  it("should throw an error if fromAccount has insufficient balance", async () => {
    const transactionData: CreateTransactionDTO = {
      fromAccountId,
      amount: transactionAmount, // 100
      description: "Insufficient balance",
      date: new Date(),
      type: TransactionTypeValues[TransactionType.EXPENSE],
      categoryId,
    };

    const fromAccount = { id: fromAccountId, balance: 50 };

    bankAccountRepositoryMock.getById.mockResolvedValueOnce(fromAccount);
    categoryRepositoryMock.getById.mockResolvedValue({ id: categoryId });

    await expect(
      sut.createTransaction(userId, transactionData)
    ).rejects.toMatchObject({
      statusCode: 422,
      message: "Saldo insuficiente na conta de origem.",
    });

    expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunnerMock.release).toHaveBeenCalled();
  });
});
