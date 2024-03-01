import { WorkspaceAccess } from "@/workspace-access/entities/workspace-access.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Workspace {
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

  // relations
  @OneToMany(
    () => WorkspaceAccess,
    (workspaceAccess) => workspaceAccess.workspace,
  )
  workspaceAccesses: WorkspaceAccess[];
}
