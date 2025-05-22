import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { BankAccount } from "./BankAccount";
import { Recurrence } from "../enums/Recurrence.enum";
import { ScheduledTransactionStatus } from "../enums/ScheduledTransactionsStatus.enum";

@Entity()
export class ScheduledTransaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.scheduledTransactons)
  user: User;

  @ManyToOne(() => BankAccount, (account) => account.scheduledTransactions)
  bankAccount: BankAccount;

  @Column()
  description: string;

  @Column("decimal")
  amount: number;

  @Column({ type: "enum", enum: Recurrence })
  recurrence: Recurrence;

  @Column()
  nextDueDate: Date;

  @Column({ type: "enum", enum: ScheduledTransactionStatus })
  status: ScheduledTransactionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
