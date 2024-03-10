import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Query,
  Render,
  Body,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { LocalAuthGuard } from "./auth/local-auth.guard";
import { AuthService } from "./auth/auth.service";
import { Public } from "./decorators/public.decorator";
import { UserLoginDto } from "./auth/dto/user-login.dto";
import { ApiBody, ApiExcludeEndpoint, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users/users.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Get("date")
  date() {
    return this.appService.date();
  }

  @Public()
  @Get("env")
  env() {
    return this.appService.env();
  }

  @Public()
  @Get("version")
  version() {
    return this.appService.version();
  }

  @ApiTags("auth")
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: UserLoginDto })
  @Post("login")
  async login(@Request() req) {
    return await this.authService.generateToken(req.user);
  }

  @ApiTags("auth")
  @Public()
  @Post("forgot-password")
  async forgotPassword(@Body("email") email: string) {
    return await this.authService.forgotPassword(email);
  }

  // Views

  @ApiExcludeEndpoint()
  @Public()
  @Get("reset-password")
  @Render("reset-password")
  async resetPasswordPage(@Query("token") token: string) {
    return { token };
  }

  @ApiExcludeEndpoint()
  @Public()
  @Post("reset-password")
  @Render("reset-password-result")
  async resetPasswordAction(
    @Body("token") token: string,
    @Body("newPassword") newPassword: string,
    @Body("confirmPassword") confirmPassword: string,
  ) {
    if (newPassword !== confirmPassword) {
      return {
        error: "Passwords do not match.",
      };
    }
    try {
      await this.authService.resetPassword(token, newPassword);
    } catch (error) {
      console.error(error);
      return {
        error: "Failed to reset password.",
      };
    }

    return {
      message: "Password reset successfully.",
    };
  }

  @ApiExcludeEndpoint()
  @Public()
  @Get("verify-email")
  @Render("verify-email")
  async verifyEmailPage(@Query("token") token: string) {
    try {
      await this.usersService.verifyEmail(token);
    } catch (error) {
      console.error(error);
      return {
        message: "Failed to verify email. Please try again later.",
      };
    }

    return {
      message: "Email verified successfully.",
    };
  }
}
