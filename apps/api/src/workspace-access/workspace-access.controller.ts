import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { WorkspaceAccessService } from "./workspace-access.service";
import { CreateWorkspaceAccessDto } from "./dto/create-workspace-access.dto";
import { UpdateWorkspaceAccessDto } from "./dto/update-workspace-access.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "@/decorators/roles.decorator";
import { Role } from "@/enums/role.enum";

@ApiBearerAuth()
@ApiTags("admin")
@Roles(Role.Admin)
@Controller("admin/workspace-access")
export class WorkspaceAccessController {
  constructor(
    private readonly workspaceAccessService: WorkspaceAccessService,
  ) {}

  @Post()
  create(@Body() createWorkspaceAccessDto: CreateWorkspaceAccessDto) {
    return this.workspaceAccessService.create(createWorkspaceAccessDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll() {
    return this.workspaceAccessService.findAll();
  }

  @Get(":id")
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param("id") id: string) {
    return this.workspaceAccessService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateWorkspaceAccessDto: UpdateWorkspaceAccessDto,
  ) {
    return this.workspaceAccessService.update(+id, updateWorkspaceAccessDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.workspaceAccessService.remove(+id);
  }
}
