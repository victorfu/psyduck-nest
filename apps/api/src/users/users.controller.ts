import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBearerAuth, ApiExcludeController, ApiTags } from "@nestjs/swagger";

@ApiExcludeController()
@ApiBearerAuth()
@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":uid")
  findOne(@Param("uid") uid: string) {
    return this.usersService.getUser(uid);
  }
}
