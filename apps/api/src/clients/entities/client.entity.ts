import { AuditableEntity } from "@/auditable.entity";
import { Column, Entity, Generated, PrimaryColumn } from "typeorm";

@Entity()
export class Client extends AuditableEntity {
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

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  height: number;

  @Column({ nullable: true })
  weight: number;
}
