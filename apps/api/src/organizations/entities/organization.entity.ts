import { AuditableEntity } from "@/auditable.entity";
import { Column, Entity, Generated, PrimaryColumn } from "typeorm";

@Entity()
export class Organization extends AuditableEntity {
  @PrimaryColumn({ update: false })
  @Generated("increment")
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;
}
