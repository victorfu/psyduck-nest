import { Controller, Get, Body, Patch, Request, Post } from "@nestjs/common";
import { AccountService } from "./account.service";
import { UpdateAccountDto } from "./dto/update-account.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ChangePasswordDto } from "@/auth/dto/change-password.dto";
import { SetLocalPasswordDto } from "@/auth/dto/set-local-password.dto";
import { AuthService } from "@/auth/auth.service";

@ApiTags("account")
@Controller("account")
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly authService: AuthService,
  ) {}

  @ApiBearerAuth()
  @Get()
  get(@Request() req) {
    return req.user;
  }

  @ApiBearerAuth()
  @Patch()
  update(@Request() req, @Body() updateAccountDto: UpdateAccountDto) {
    const id = req.user.id;
    return this.accountService.update(id, updateAccountDto);
  }

  @ApiBearerAuth()
  @Post("has-local-auth")
  async hasLocalAuth(@Request() req) {
    const hasLocalAuth = await this.accountService.hasLocalAuth(req.user.id);
    return { hasLocalAuth };
  }

  @ApiBearerAuth()
  @Post("send-verification-email")
  sendVerificationEmail(@Request() req) {
    return this.accountService.sendVerificationEmail(req.user);
  }

  @ApiBearerAuth()
  @Post("change-password")
  async changePassword(@Request() req, @Body() body: ChangePasswordDto) {
    return await this.authService.changePassword(req.user, body);
  }

  @ApiBearerAuth()
  @Post("set-local-password")
  async setLocalPassword(@Request() req, @Body() body: SetLocalPasswordDto) {
    return await this.authService.setLocalPassword(req.user, body);
  }
}
