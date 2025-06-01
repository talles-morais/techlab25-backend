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
import { CreditInvoice } from "./CreditInvoice";
import { Transaction } from "./Transaction";

@Entity()
export class CreditCard {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.creditCards)
  user: User;

  @Column()
  name: string;

  @Column("decimal", {
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
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
