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
import { ApiBearerAuth, ApiExcludeController, ApiTags } from "@nestjs/swagger";
import { Roles } from "@/decorators/roles.decorator";
import { Role } from "@/enums/role.enum";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@ApiExcludeController()
@ApiBearerAuth()
@ApiTags("admin")
@Controller("admin/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(@Request() req, @Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Roles(Role.Admin)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":uid")
  findOne(@Param("uid") uid: string) {
    return this.usersService.getUser(uid);
  }

  @Roles(Role.Admin)
  @Patch(":uid")
  update(
    @Request() req,
    @Param("uid") uid: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.updateUser(uid, body);
  }

  @Roles(Role.Admin)
  @Delete(":uid")
  remove(@Param("uid") uid: string) {
    return this.usersService.deleteUser(uid);
  }

  @Roles(Role.Admin)
  @Post(":uid/reset-password")
  resetPassword(@Param("uid") uid: string, @Body() body: ResetPasswordDto) {
    return this.usersService.resetPassword(uid, body);
  }

  @Roles(Role.Admin)
  @Get()
  listUsers(
    @Query("maxResults") maxResults: number,
    @Query("pageToken") pageToken: string,
  ) {
    return this.usersService.listUsers(maxResults, pageToken);
  }
}
