import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TransactionService } from "../services/transaction.service";
import { CreateTransactionSchema } from "../dtos/transaction/create-transaction.dto";

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService(AppDataSource);
  }

  createTransaction = async (req: Request, res: Response) => {
    const transactionData = CreateTransactionSchema.parse(req.body);

    const transaction = await this.transactionService.createTransaction(
      req.user.id,
      transactionData
    );

    res.status(201).json(transaction);
  };
}
