import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { BankAccount } from "./BankAccount";
import { CreditCard } from "./CreditCard";
import { Transaction } from "./Transaction";
import { Category } from "./Category";
import { ScheduledTransaction } from "./ScheduledTransaction";

@Entity()
@Index(["email"], { unique: true })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => BankAccount, (account) => account.user)
  bankAccounts: BankAccount[];

  @OneToMany(() => CreditCard, (creditCard) => creditCard.user)
  creditCards: CreditCard[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => ScheduledTransaction, (transaction) => transaction.user)
  scheduledTransactons: ScheduledTransaction[];

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
