import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import config from "./config/config";
import { BankAccount } from "./entities/BankAccount";
import { Transaction } from "./entities/Transaction";
import { Category } from "./entities/Category";
import { CreditCard } from "./entities/CreditCard";
import { CreditInvoice } from "./entities/CreditInvoice";
import { ScheduledTransaction } from "./entities/ScheduledTransaction";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.postgres.host,
  port: config.postgres.port,
  username: config.postgres.user,
  password: config.postgres.password,
  database: config.postgres.database,
  synchronize: true,
  logging: false,
  entities: [
    User,
    BankAccount,
    Transaction,
    Category,
    CreditCard,
    CreditInvoice,
    ScheduledTransaction,
  ],
  migrations: [],
  subscribers: [],
});
