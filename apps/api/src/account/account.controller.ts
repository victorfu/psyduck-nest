import { Controller, Get, Body, Patch, Request, Post } from "@nestjs/common";
import { AccountService } from "./account.service";
import { UpdateAccountDto } from "./dto/update-account.dto";

@Controller("account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  get(@Request() req) {
    return req.user;
  }

  @Patch()
  update(@Request() req, @Body() updateAccountDto: UpdateAccountDto) {
    const id = req.user.id;
    return this.accountService.update(id, updateAccountDto);
  }

  @Post("has-local-auth")
  async hasLocalAuth(@Request() req) {
    const hasLocalAuth = await this.accountService.hasLocalAuth(req.user.id);
    return { hasLocalAuth };
  }
}
