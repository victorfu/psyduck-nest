import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Note {
  @PrimaryColumn({ update: false })
  @Generated("increment")
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
