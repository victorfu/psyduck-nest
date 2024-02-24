import { Injectable } from "@nestjs/common";
import { UpdateAccountDto } from "./dto/update-account.dto";
import { UsersService } from "../users/users.service";

@Injectable()
export class AccountService {
  constructor(private readonly usersService: UsersService) {}

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return this.usersService.update(id, updateAccountDto);
  }

  hasLocalAuth(id: number) {
    return this.usersService.hasLocalAuth(id);
  }
}
