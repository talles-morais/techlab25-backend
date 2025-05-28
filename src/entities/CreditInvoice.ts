import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CreditCard } from "./CreditCard";
import { CreditInvoiceStatus } from "../enums/CreditInvoiceStatus.enum";
import { Transaction } from "./Transaction";

@Entity()
export class CreditInvoice {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => CreditCard, (creditCard) => creditCard.invoices)
  creditCard: CreditCard;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column("decimal", {
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  totalAmount: number;

  @Column({ type: "enum", enum: CreditInvoiceStatus })
  status: CreditInvoiceStatus;

  @OneToMany(() => Transaction, (transaction) => transaction.invoice)
  transactions?: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
