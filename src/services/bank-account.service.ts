import { CreateBankAccountDTO } from "../dtos/bank-account/create-bank-account.dto";
import { BankAccount } from "../entities/BankAccount";
import { User } from "../entities/User";
import { BankAccountType } from "../enums/BankAccountType.enum";
import { BankAccountRepository } from "../repositories/bank-account.repository";

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
}
