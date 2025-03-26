import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { WorkspacesService } from "./workspaces.service";

@ApiTags("workspaces")
@ApiBearerAuth()
@Controller("workspaces")
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get(":id/team-members")
  findTeamMembers(@Param("id") id: string) {
    return this.workspacesService.findTeamMembers(id);
  }

  @Get("cp")
  findCpWorkspaces() {
    return this.workspacesService.findCpWorkspaces();
  }
}
