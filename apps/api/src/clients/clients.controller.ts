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
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "@/decorators/roles.decorator";
import { Role } from "@/enums/role.enum";

@ApiBearerAuth()
@ApiTags("admin")
@Roles(Role.Admin)
@Controller("admin/clients")
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Request() req, @Body() createClientDto: CreateClientDto) {
    const user = req.user;
    createClientDto.createdBy = user.id;
    createClientDto.updatedBy = user.id;
    return this.clientsService.create(createClientDto);
  }

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.clientsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Request() req,
    @Param("id") id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    const user = req.user;
    updateClientDto.updatedBy = user.id;
    return this.clientsService.update(+id, updateClientDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.clientsService.remove(+id);
  }
}
