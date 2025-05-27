import { CreateBankAccountDTO } from "../dtos/bank-account/create-bank-account.dto";
import { UpdateBankAccountDTO } from "../dtos/bank-account/update-bank-account.dto";
import { BankAccount } from "../entities/BankAccount";
import { User } from "../entities/User";
import { BankAccountType } from "../enums/BankAccountType.enum";
import { BankAccountRepository } from "../repositories/bank-account.repository";
import { HttpError } from "../utils/http-error";

export class BankAccountService {
  constructor(private bankAccountRepository: BankAccountRepository) {}

  async createBankAccount(
    userId: string,
    bankAccountData: CreateBankAccountDTO
  ) {
    const user = new User();
    user.id = userId;

    const bankAccount = new BankAccount();
    bankAccount.name = bankAccountData.name;
    bankAccount.type = BankAccountType[bankAccountData.type];
    bankAccount.balance = bankAccountData.balance;
    bankAccount.user = user;

    const createdBankAccount = await this.bankAccountRepository.create(
      bankAccount
    );

    return createdBankAccount;
  }

  async getAllBankAccounts(userId: string) {
    const bankAccounts = await this.bankAccountRepository.getAll(userId);

    return bankAccounts;
  }

  async updateBankAccount(
    userId: string,
    bankAccountId: string,
    bankAccountData: UpdateBankAccountDTO
  ) {
    const bankAccountExists = await this.bankAccountRepository.getById(
      userId,
      bankAccountId
    );

    if (!bankAccountExists) {
      throw new HttpError(404, "Conta bancária não encontrada");
    }

    if (bankAccountExists.user.id !== userId) {
      throw new HttpError(
        403,
        "Você não tem permissão para atualizar esta conta bancária."
      );
    }

    bankAccountExists.name = bankAccountData.name;
    bankAccountExists.type = BankAccountType[bankAccountData.type];
    bankAccountExists.balance = bankAccountData.balance;

    const updatedBankAccount = await this.bankAccountRepository.update(
      userId,
      bankAccountExists
    );
    return updatedBankAccount;
  }

  async deleteBankAccount(userId: string, bankAccountId: string) {
    const bankAccountExists = await this.bankAccountRepository.getById(
      userId,
      bankAccountId
    );

    if (!bankAccountExists) {
      throw new HttpError(404, "Conta bancária não encontrada");
    }

    if (bankAccountExists.user.id !== userId) {
      throw new HttpError(
        403,
        "Você não tem permissão para deletar esta conta bancária."
      );
    }

    await this.bankAccountRepository.delete(userId, bankAccountExists.id);
  }
}
