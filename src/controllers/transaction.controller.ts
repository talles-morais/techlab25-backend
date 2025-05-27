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

  getTransactions = async (req: Request, res: Response) => {
    const DEFAULT_PAGE = 1;
    const DEFAULT_LIMIT = 10;

    const page = parseInt(req.query.page as string) || DEFAULT_PAGE;
    const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;

    const transactions = await this.transactionService.getTransactions(req.user.id, {
      page,
      limit,
    });

    res.status(200).json(transactions);
  };

  getAllTransactions = async (req: Request, res: Response) => {
    const transactions = await this.transactionService.getAllTransactions(req.user.id)

    res.status(200).json(transactions)
  }
}
