import { AuditableEntity } from "@/common/auditable.entity";
import { WorkspaceAccess } from "@/workspace-access/entities/workspace-access.entity";
import { Column, Entity, Generated, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Workspace extends AuditableEntity {
  @PrimaryColumn({ update: false })
  @Generated("increment")
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  manager: string;

  // relations
  @OneToMany(
    () => WorkspaceAccess,
    (workspaceAccess) => workspaceAccess.workspace,
    {
      cascade: true,
    },
  )
  workspaceAccesses: WorkspaceAccess[];
}
