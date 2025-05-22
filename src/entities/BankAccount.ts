import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { BankAccountType } from "../enums/BankAccountType.enum";
import { Transaction } from "./Transaction";
import { ScheduledTransaction } from "./ScheduledTransaction";

@Entity()
export class BankAccount {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.bankAccounts)
  user: User;

  @Column()
  name: string;

  @Column({ type: "enum", enum: BankAccountType })
  type: BankAccountType;

  @Column("decimal")
  balance: number;

  @OneToMany(() => Transaction, (transaction) => transaction.fromAccount, {
    nullable: true,
  })
  outgoingTransactions?: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.toAccount, {
    nullable: true,
  })
  incomingTransactions?: Transaction[];

  @OneToMany(() => ScheduledTransaction, (transaction) => transaction.bankAccount, {
    nullable: true,
  })
  scheduledTransactions?: ScheduledTransaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
