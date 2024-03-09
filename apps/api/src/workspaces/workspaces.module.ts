import { Module } from "@nestjs/common";
import { WorkspacesService } from "./workspaces.service";
import { WorkspacesController } from "./workspaces.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Workspace } from "./entities/workspace.entity";
import { AdminWorkspacesController } from "./admin-workspaces.controller";
import { WorkspaceAccessModule } from "@/workspace-access/workspace-access.module";

@Module({
  imports: [TypeOrmModule.forFeature([Workspace]), WorkspaceAccessModule],
  controllers: [WorkspacesController, AdminWorkspacesController],
  providers: [WorkspacesService],
  exports: [WorkspacesService],
})
export class WorkspacesModule {}
