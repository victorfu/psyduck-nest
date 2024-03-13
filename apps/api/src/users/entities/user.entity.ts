import { AuditableEntity } from "@/auditable.entity";
import { WorkspaceAccess } from "@/workspace-access/entities/workspace-access.entity";
import { Exclude } from "class-transformer";
import { Column, Entity, Generated, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class User extends AuditableEntity {
  @PrimaryColumn({ update: false })
  @Generated("increment")
  id: number;

  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  emailVerified: boolean;

  @Exclude()
  @Column({ nullable: true })
  emailVerificationToken: string;

  @Exclude()
  @Column({ nullable: true })
  passwordResetToken: string;

  @Exclude()
  @Column({ nullable: true })
  passwordResetTokenExpiration: Date;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column("simple-array", {
    default: () => "('user')",
  })
  roles: string[];

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  birthday: string;

  @Column({ nullable: true })
  language: string;

  @Column({ nullable: true })
  oauthGoogleRaw: string;

  // relations
  @OneToMany(() => WorkspaceAccess, (workspaceAccess) => workspaceAccess.user)
  workspaceAccesses: WorkspaceAccess[];
}
