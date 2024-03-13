import { AuditableEntity } from "@/common/auditable.entity";
import { User } from "@/users/entities/user.entity";
import { Workspace } from "@/workspaces/entities/workspace.entity";
import {
  Column,
  Entity,
  Generated,
  Index,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";

@Entity()
@Index(["user.id", "workspace.id"], { unique: true })
export class WorkspaceAccess extends AuditableEntity {
  @PrimaryColumn({ update: false })
  @Generated("increment")
  id: number;

  @Column()
  role: string;

  // relations
  @ManyToOne(() => User, (user) => user.workspaceAccesses, { eager: true })
  user: User;

  @ManyToOne(() => Workspace, (workspace) => workspace.workspaceAccesses, {
    eager: true,
  })
  workspace: Workspace;
}
