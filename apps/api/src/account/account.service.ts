import { Injectable } from "@nestjs/common";
import { UpdateAccountDto } from "./dto/update-account.dto";
import { UsersService } from "../users/users.service";
import { User } from "@/users/entities/user.entity";

@Injectable()
export class AccountService {
  constructor(private readonly usersService: UsersService) {}

  async update(id: number, updateAccountDto: UpdateAccountDto) {
    return await this.usersService.update(id, updateAccountDto);
  }

  async hasLocalAuth(id: number) {
    return await this.usersService.hasLocalAuth(id);
  }

  async sendVerificationEmail(user: User) {
    await this.usersService.sendVerificationEmail(user);
  }
}
