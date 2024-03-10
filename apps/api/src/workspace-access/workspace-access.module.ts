import { Module } from "@nestjs/common";
import { WorkspaceAccessService } from "./workspace-access.service";
import { WorkspaceAccessController } from "./workspace-access.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkspaceAccess } from "./entities/workspace-access.entity";

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceAccess])],
  controllers: [WorkspaceAccessController],
  providers: [WorkspaceAccessService],
  exports: [WorkspaceAccessService],
})
export class WorkspaceAccessModule {}
