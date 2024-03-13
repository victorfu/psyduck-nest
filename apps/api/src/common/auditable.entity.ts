import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class AuditableEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  createdBy: number;

  @Column({ nullable: true })
  updatedBy: number;
}
