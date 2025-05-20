import {
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { BankAccountType } from "../enums/BankAccountType";
import { Transaction } from "./Transaction";

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
