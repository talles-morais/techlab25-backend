import { UpdateTransactionDTO } from "../../../src/dtos/transaction/update-transaction.dto";
import {
  TransactionType,
  TransactionTypeValues,
} from "../../../src/enums/TransactionType.enum";
import { HttpError } from "../../../src/utils/http-error";
import {
  clearAllMocks,
  makeSutForTransactionService,
} from "../helpers/makeSutForTransactionService";

describe("Transaction service - Update transaction", () => {
  const userId = "user-123";
  const transactionId = "transaction-1";
  const fromAccountId = "account-1";
  const toAccountId = "account-2";
  const categoryId = "category-1";

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

  it("should update the balance correctly when updating a transaction keeping the same accounts", async () => {
    const oldFromAccount = { id: fromAccountId, balance: 500 };
    const oldToAccount = { id: toAccountId, balance: 200 };
    const transactionExists = {
      id: transactionId,
      fromAccount: { ...oldFromAccount },
      toAccount: { ...oldToAccount },
      amount: 50,
      category: { id: categoryId },
    };

    const transactionData: UpdateTransactionDTO = {
      fromAccountId,
      toAccountId,
      amount: 100,
      description: "Atualização de valor",
      date: new Date(),
      type: TransactionTypeValues[TransactionType.EXPENSE],
      categoryId,
    };

    transactionRepositoryMock.findById.mockResolvedValue(transactionExists);
    bankAccountRepositoryMock.getById
      .mockResolvedValueOnce({ ...oldFromAccount }) // fromAccount
      .mockResolvedValueOnce({ ...oldToAccount }); // toAccount
    categoryRepositoryMock.getById.mockResolvedValue({ id: categoryId });
    transactionRepositoryMock.update.mockResolvedValue({ id: transactionId });

    await sut.updateTransaction(userId, transactionId, transactionData);

    // O saldo da conta de origem deve ser: saldo antigo + valor antigo - novo valor
    expect(bankAccountRepositoryMock.update).toHaveBeenCalledWith(
      userId,
      expect.objectContaining({
        id: fromAccountId,
        balance: oldFromAccount.balance + 50 - 100,
      })
    );
    // O saldo da conta de destino deve ser: saldo antigo - valor antigo + novo valor
    expect(bankAccountRepositoryMock.update).toHaveBeenCalledWith(
      userId,
      expect.objectContaining({
        id: toAccountId,
        balance: oldToAccount.balance - 50 + 100,
      })
    );
    expect(queryRunnerMock.commitTransaction).toHaveBeenCalled();
    expect(queryRunnerMock.release).toHaveBeenCalled();
  });

  it("should update the balance correctly when changing the source account", async () => {
    const oldFromAccount = { id: fromAccountId, balance: 500 };
    const newFromAccountId = "account-3";
    const newFromAccount = { id: newFromAccountId, balance: 300 };
    const toAccount = { id: toAccountId, balance: 200 };
    const transactionExists = {
      id: transactionId,
      fromAccount: { ...oldFromAccount },
      toAccount: { ...toAccount },
      amount: 50,
      category: { id: categoryId },
    };

    const transactionData: UpdateTransactionDTO = {
      fromAccountId: newFromAccountId,
      toAccountId,
      amount: 100,
      description: "Troca conta origem",
      date: new Date(),
      type: TransactionTypeValues[TransactionType.EXPENSE],
      categoryId,
    };

    transactionRepositoryMock.findById.mockResolvedValue(transactionExists);

    bankAccountRepositoryMock.getById
      .mockResolvedValueOnce({ ...oldFromAccount }) // old fromAccount (para reembolso)
      .mockResolvedValueOnce({ ...newFromAccount }) // new fromAccount (para débito)
      .mockResolvedValueOnce({ ...toAccount }); // toAccount (para ajuste)

    categoryRepositoryMock.getById.mockResolvedValue({ id: categoryId });
    transactionRepositoryMock.update.mockResolvedValue({ id: transactionId });

    await sut.updateTransaction(userId, transactionId, transactionData);

    expect(bankAccountRepositoryMock.update).toHaveBeenCalledWith(
      userId,
      expect.objectContaining({
        id: fromAccountId,
        balance: oldFromAccount.balance + transactionExists.amount,
      })
    );

    expect(bankAccountRepositoryMock.update).toHaveBeenCalledWith(
      userId,
      expect.objectContaining({
        id: newFromAccountId,
        balance: newFromAccount.balance - transactionData.amount,
      })
    );

    expect(bankAccountRepositoryMock.update).toHaveBeenCalledWith(
      userId,
      expect.objectContaining({
        id: toAccountId,
        balance:
          toAccount.balance - transactionExists.amount + transactionData.amount,
      })
    );

    expect(queryRunnerMock.commitTransaction).toHaveBeenCalled();
    expect(queryRunnerMock.release).toHaveBeenCalled();
  });

  it("should update the balance correctly when changing the destination account", async () => {
    const fromAccount = { id: fromAccountId, balance: 500 };
    const oldToAccount = { id: toAccountId, balance: 200 };
    const newToAccountId = "account-4";
    const newToAccount = { id: newToAccountId, balance: 100 };
    const transactionExists = {
      id: transactionId,
      fromAccount: { ...fromAccount },
      toAccount: { ...oldToAccount },
      amount: 50,
      category: { id: categoryId },
    };

    const transactionData: UpdateTransactionDTO = {
      fromAccountId,
      toAccountId: newToAccountId,
      amount: 100,
      description: "Troca conta destino",
      date: new Date(),
      type: TransactionTypeValues[TransactionType.EXPENSE],
      categoryId,
    };

    transactionRepositoryMock.findById.mockResolvedValue(transactionExists);
    bankAccountRepositoryMock.getById
      .mockResolvedValueOnce({ ...fromAccount }) // fromAccount (para ajuste)
      .mockResolvedValueOnce({ ...oldToAccount }) // old toAccount (para remoção)
      .mockResolvedValueOnce({ ...newToAccount }); // new toAccount (para adição)
    categoryRepositoryMock.getById.mockResolvedValue({ id: categoryId });
    transactionRepositoryMock.update.mockResolvedValue({ id: transactionId });

    await sut.updateTransaction(userId, transactionId, transactionData);

    // 1ª chamada: Ajusta a conta de origem (mesmo ID, mas valor diferente)
    // Restaura o valor antigo (500 + 50) e debita o novo valor (550 - 100)
    expect(bankAccountRepositoryMock.update).toHaveBeenNthCalledWith(
      1,
      userId,
      expect.objectContaining({
        id: fromAccountId,
        balance:
          fromAccount.balance +
          transactionExists.amount -
          transactionData.amount, // 500 + 50 - 100 = 450
      })
    );

    // 2ª chamada: Remove o valor da conta de destino antiga
    expect(bankAccountRepositoryMock.update).toHaveBeenNthCalledWith(
      2,
      userId,
      expect.objectContaining({
        id: toAccountId,
        balance: oldToAccount.balance - transactionExists.amount, // 200 - 50 = 150
      })
    );

    // 3ª chamada: Adiciona o valor na nova conta de destino
    expect(bankAccountRepositoryMock.update).toHaveBeenNthCalledWith(
      3,
      userId,
      expect.objectContaining({
        id: newToAccountId,
        balance: newToAccount.balance + transactionData.amount, // 100 + 100 = 200
      })
    );

    expect(queryRunnerMock.commitTransaction).toHaveBeenCalled();
    expect(queryRunnerMock.release).toHaveBeenCalled();
  });

  it("should throw an error if the new source account balance is insufficient", async () => {
    const oldFromAccount = { id: fromAccountId, balance: 500 };
    const newFromAccountId = "account-3";
    const newFromAccount = { id: newFromAccountId, balance: 50 }; // saldo insuficiente
    const toAccount = { id: toAccountId, balance: 200 };
    const transactionExists = {
      id: transactionId,
      fromAccount: { ...oldFromAccount },
      toAccount: { ...toAccount },
      amount: 50,
      category: { id: categoryId },
    };

    const transactionData: UpdateTransactionDTO = {
      fromAccountId: newFromAccountId,
      toAccountId,
      amount: 100,
      description: "Saldo insuficiente",
      date: new Date(),
      type: TransactionTypeValues[TransactionType.EXPENSE],
      categoryId,
    };

    transactionRepositoryMock.findById.mockResolvedValue(transactionExists);
    bankAccountRepositoryMock.getById
      .mockResolvedValueOnce({ ...oldFromAccount }) // old fromAccount
      .mockResolvedValueOnce({ ...newFromAccount }) // new fromAccount
      .mockResolvedValueOnce({ ...toAccount }); // toAccount
    categoryRepositoryMock.getById.mockResolvedValue({ id: categoryId });

    await expect(
      sut.updateTransaction(userId, transactionId, transactionData)
    ).rejects.toMatchObject({
      statusCode: 422,
      message: "Saldo insuficiente na nova conta de origem.",
    });

    expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunnerMock.release).toHaveBeenCalled();
  });

  it("should throw an error if the same source account balance becomes negative", async () => {
    const fromAccount = { id: fromAccountId, balance: 100 };
    const toAccount = { id: toAccountId, balance: 200 };
    const transactionExists = {
      id: transactionId,
      fromAccount: { ...fromAccount },
      toAccount: { ...toAccount },
      amount: 50,
      category: { id: categoryId },
    };

    const transactionData: UpdateTransactionDTO = {
      fromAccountId,
      toAccountId,
      amount: 300,
      description: "Saldo negativo",
      date: new Date(),
      type: TransactionTypeValues[TransactionType.EXPENSE],
      categoryId,
    };

    transactionRepositoryMock.findById.mockResolvedValue(transactionExists);
    bankAccountRepositoryMock.getById
      .mockResolvedValueOnce({ ...fromAccount }) // fromAccount
      .mockResolvedValueOnce({ ...toAccount }); // toAccount
    categoryRepositoryMock.getById.mockResolvedValue({ id: categoryId });

    await expect(
      sut.updateTransaction(userId, transactionId, transactionData)
    ).rejects.toMatchObject({
      statusCode: 422,
      message: "Saldo insuficiente na conta de origem.",
    });

    expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunnerMock.release).toHaveBeenCalled();
  });
});
