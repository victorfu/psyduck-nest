import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { LocalAuthGuard } from "./auth/local-auth.guard";
import { AuthService } from "./auth/auth.service";
import { Public } from "./decorators/public.decorator";
import { UserLoginDto } from "./auth/dto/user-login.dto";
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { ChangePasswordDto } from "./auth/dto/change-password.dto";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Get("date")
  date() {
    return this.appService.date();
  }

  @Public()
  @Get("version")
  version() {
    return this.appService.version();
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: UserLoginDto })
  @Post("login")
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @Get("me")
  me(@Request() req) {
    return req.user;
  }

  @ApiBearerAuth()
  @Post("change-password")
  async changePassword(@Request() req, @Body() body: ChangePasswordDto) {
    return await this.authService.changePassword(req.user, body);
  }
}
