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
} from "@nestjs/common";
import { WorkspacesService } from "./workspaces.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "@/decorators/roles.decorator";
import { Role } from "@/enums/role.enum";

@ApiBearerAuth()
@ApiTags("admin")
@Roles(Role.Admin)
@Controller("admin/workspaces")
export class AdminWorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  create(@Request() req, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    const user = req.user;
    createWorkspaceDto.createdBy = user.id;
    createWorkspaceDto.updatedBy = user.id;
    return this.workspacesService.create(createWorkspaceDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll() {
    return this.workspacesService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.workspacesService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Request() req,
    @Param("id") id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    const user = req.user;
    updateWorkspaceDto.updatedBy = user.id;
    return this.workspacesService.update(+id, updateWorkspaceDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.workspacesService.remove(+id);
  }
}
