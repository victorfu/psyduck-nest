import { AuditableEntity } from "@/auditable.entity";
import { Column, Entity, Generated, PrimaryColumn } from "typeorm";

@Entity()
export class Note extends AuditableEntity {
  @PrimaryColumn({ update: false })
  @Generated("increment")
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  content: string;
}
