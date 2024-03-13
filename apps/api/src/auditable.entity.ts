import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class AuditableEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //   TODO: implement createdBy and updatedBy
  //   @Column({ nullable: true })
  //   createdBy: string;

  //   @Column({ nullable: true })
  //   updatedBy: string;
}
