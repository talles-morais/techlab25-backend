import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Transaction } from "./Transaction";
import { User } from "./User";

@Entity()
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.categories)
  user: User;

  @Column()
  name: string;

  @Column({ nullable: true })
  iconName: string;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions?: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
