import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
  ForbiddenException,
} from "@nestjs/common";
import { WorkspacesService } from "./workspaces.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { ApiTags } from "@nestjs/swagger";
import { WorkspaceAccessService } from "@/workspace-access/workspace-access.service";

@ApiTags("workspaces")
@Controller("workspaces")
export class WorkspacesController {
  constructor(
    private readonly workspacesService: WorkspacesService,
    private readonly workspaceAccessService: WorkspaceAccessService,
  ) {}

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

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id/members")
  async findMembers(@Request() req, @Param("id") id: string) {
    const user = req.user;
    const workspaces = await this.workspacesService.findAllByUserId(user.id);
    if (!workspaces.find((w) => w.id === +id)) {
      throw new ForbiddenException();
    }
    return this.workspaceAccessService.findAllByWorkspaceId(+id);
  }

  @Patch(":id")
  async update(
    @Request() req,
    @Param("id") id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    const user = req.user;
    const workspaces = await this.workspacesService.findAllByUserId(user.id);
    if (!workspaces.find((w) => w.id === +id)) {
      throw new ForbiddenException();
    }
    return this.workspacesService.update(+id, updateWorkspaceDto);
  }

  @Delete(":id")
  remove(@Request() req, @Param("id") id: string) {
    const user = req.user;
    return this.workspacesService.removeByUserId(+id, user.id);
  }
}
