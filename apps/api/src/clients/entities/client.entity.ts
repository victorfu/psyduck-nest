import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Client {
  @PrimaryColumn({ update: false })
  @Generated("increment")
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  birthday: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: true })
  address: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
