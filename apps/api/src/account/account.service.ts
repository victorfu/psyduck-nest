import { Injectable } from "@nestjs/common";
import { UpdateAccountDto } from "./dto/update-account.dto";
import { UsersService } from "../users/users.service";

@Injectable()
export class AccountService {
  constructor(private readonly usersService: UsersService) {}

  async update(id: number, updateAccountDto: UpdateAccountDto) {
    return await this.usersService.update(id, updateAccountDto);
  }

  async hasLocalAuth(id: number) {
    return await this.usersService.hasLocalAuth(id);
  }
}
