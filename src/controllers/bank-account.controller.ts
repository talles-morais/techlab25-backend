import { Request, Response } from "express";
import { BankAccountService } from "../services/bank-account.service";
import { CreateBankAccountSchema } from "../dtos/bank-account/create-bank-account.dto";
import { BankAccountRepository } from "../repositories/bank-account.repository";
import { UpdateBankAccountSchema } from "../dtos/bank-account/update-bank-account.dto";
import { AppDataSource } from "../data-source";

export class BankAccountController {
  private bankAccountService: BankAccountService;

  constructor() {
    const entityManager = AppDataSource.manager;
    const bankAccountRepository = new BankAccountRepository(entityManager);
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

  getAllBankAccounts = async (req: Request, res: Response) => {
    const bankAccounts = await this.bankAccountService.getAllBankAccounts(
      req.user.id
    );

    res.status(200).json(bankAccounts);
  };

  updateBankAccount = async (req: Request, res: Response) => {
    const bankAccountId = req.params.id;
    const bankAccountData = UpdateBankAccountSchema.parse(req.body);

    const bankAccount = await this.bankAccountService.updateBankAccount(
      req.user.id,
      bankAccountId,
      bankAccountData
    );

    res.status(200).json(bankAccount);
  };

  deleteBankAccount = async (req: Request, res: Response) => {
    const bankAccountId = req.params.id;

    await this.bankAccountService.deleteBankAccount(req.user.id, bankAccountId);

    res.sendStatus(204);
  };
}
