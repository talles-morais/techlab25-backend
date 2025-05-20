import {
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { CreditInvoice } from "./CreditInvoice";
import { Transaction } from "./Transaction";

export class CreditCard {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.creditCards)
  user: User;

  @Column()
  name: string;

  @Column("decimal")
  limit: number;

  @Column("int")
  closingDay: number;

  @Column("int")
  dueDay: number;

  @OneToMany(() => CreditInvoice, (invoice) => invoice.creditCard, {
    nullable: true,
  })
  invoices?: CreditInvoice[];

  @OneToMany(() => Transaction, (transaction) => transaction.creditCard, {
    nullable: true,
  })
  transactions?: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
