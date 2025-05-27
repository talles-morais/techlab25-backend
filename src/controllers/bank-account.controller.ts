import { Request, Response } from "express";
import { BankAccountService } from "../services/bank-account.service";
import { CreateBankAccountSchema } from "../dtos/bank-account/create-bank-account.dto";
import { BankAccountRepository } from "../repositories/bank-account.repository";

export class BankAccountController {
  private bankAccountService: BankAccountService;

  constructor() {
    const bankAccountRepository = new BankAccountRepository();
    this.bankAccountService = new BankAccountService(bankAccountRepository);
  }

  createBankAccount = async (req: Request, res: Response) => {
    const bankAccountData = CreateBankAccountSchema.parse(req.body);

    const bankAccount = await this.bankAccountService.createBankAccount(
      req.user.id,
      bankAccountData
    );

    res.status(201).json(bankAccount);
  };
}
