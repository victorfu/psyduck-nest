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
import { OrganizationsService } from "./organizations.service";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "@/decorators/roles.decorator";
import { Role } from "@/enums/role.enum";

@ApiBearerAuth()
@ApiTags("admin")
@Roles(Role.Admin)
@Controller("admin/organizations")
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  create(@Request() req, @Body() createOrganizationDto: CreateOrganizationDto) {
    const user = req.user;
    createOrganizationDto.createdBy = user.id;
    createOrganizationDto.updatedBy = user.id;
    return this.organizationsService.create(createOrganizationDto);
  }

  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.organizationsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Request() req,
    @Param("id") id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    const user = req.user;
    updateOrganizationDto.updatedBy = user.id;
    return this.organizationsService.update(+id, updateOrganizationDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.organizationsService.remove(+id);
  }
}
