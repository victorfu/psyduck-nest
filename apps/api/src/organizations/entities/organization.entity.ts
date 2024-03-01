import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Organization {
  @PrimaryColumn({ update: false })
  @Generated("increment")
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
