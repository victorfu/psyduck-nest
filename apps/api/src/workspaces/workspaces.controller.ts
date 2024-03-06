import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from "@nestjs/common";
import { WorkspacesService } from "./workspaces.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("workspaces")
@Controller("workspaces")
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  create(@Request() req, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    const user = req.user;
    return this.workspacesService.createByUserId(user.id, createWorkspaceDto);
  }

  @Get()
  findAll(@Request() req) {
    const user = req.user;
    return this.workspacesService.findAllByUserId(user.id);
  }

  @Get(":id")
  findOne(@Request() req, @Param("id") id: string) {
    const user = req.user;
    return this.workspacesService.findOneByUserId(+id, user.id);
  }

  @Patch(":id")
  update(
    @Request() req,
    @Param("id") id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    const user = req.user;
    return this.workspacesService.updateByUserId(
      +id,
      user.id,
      updateWorkspaceDto,
    );
  }

  @Delete(":id")
  remove(@Request() req, @Param("id") id: string) {
    const user = req.user;
    return this.workspacesService.removeByUserId(+id, user.id);
  }
}
