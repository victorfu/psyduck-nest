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
  Query,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "../decorators/roles.decorator";
import { Role } from "../enums/role.enum";

@ApiBearerAuth()
@ApiTags("admin")
@Controller("admin/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(@Request() req, @Body() createUserDto: CreateUserDto) {
    const user = req.user;
    createUserDto.createdBy = user.id;
    return this.usersService.create(createUserDto);
  }

  @Roles(Role.Admin)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(@Query("username") username) {
    if (username && username.length > 0) {
      return this.usersService.findAllByUsername(username);
    }
    return this.usersService.findAll();
  }

  @Roles(Role.Admin)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }

  @Roles(Role.Admin)
  @Patch(":id")
  update(
    @Request() req,
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = req.user;
    updateUserDto.updatedBy = user.id;
    return this.usersService.update(+id, updateUserDto);
  }

  @Roles(Role.Admin)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }

  @Roles(Role.Admin)
  @Post(":id/reset-password")
  resetPassword(@Param("id") id: string) {
    return this.usersService.setDefaultPassword(+id);
  }
}
