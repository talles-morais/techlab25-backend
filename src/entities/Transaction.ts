import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { TransactionType } from "../enums/TransactionType.enum";
import { BankAccount } from "./BankAccount";
import { CreditCard } from "./CreditCard";
import { CreditInvoice } from "./CreditInvoice";
import { User } from "./User";
import { Category } from "./Category";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @ManyToOne(() => BankAccount, (account) => account.outgoingTransactions, {
    nullable: true,
  })
  fromAccount?: BankAccount;

  @ManyToOne(() => BankAccount, (account) => account.incomingTransactions, {
    nullable: true,
  })
  toAccount?: BankAccount;

  @ManyToOne(() => CreditCard, (creditCard) => creditCard.transactions, {
    nullable: true,
  })
  creditCard?: CreditCard;

  @ManyToOne(() => CreditInvoice, (invoice) => invoice.transactions, {
    nullable: true,
  })
  invoice?: CreditInvoice;

  @Column("decimal", {
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  amount: number;

  @Column()
  description: string;

  @Column()
  date: Date;

  @Column({ type: "enum", enum: TransactionType })
  type: TransactionType;

  @ManyToOne(() => Category, (category) => category.transactions)
  category: Category;
}
