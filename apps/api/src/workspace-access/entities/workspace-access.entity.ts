import { User } from "@/users/entities/user.entity";
import { Workspace } from "@/workspaces/entities/workspace.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
@Index(["user.id", "workspace.id"], { unique: true })
export class WorkspaceAccess {
  @PrimaryColumn({ update: false })
  @Generated("increment")
  id: number;

  @Column()
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // relations
  @ManyToOne(() => User, (user) => user.workspaceAccesses, { eager: true })
  user: User;

  @ManyToOne(() => Workspace, (workspace) => workspace.workspaceAccesses, {
    eager: true,
  })
  workspace: Workspace;
}
