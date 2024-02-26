import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
  Query,
  Render,
  Body,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { LocalAuthGuard } from "./auth/local-auth.guard";
import { AuthService } from "./auth/auth.service";
import { Public } from "./decorators/public.decorator";
import { UserLoginDto } from "./auth/dto/user-login.dto";
import { ApiBearerAuth, ApiBody, ApiConsumes } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { FirebaseAdminService } from "./firebase-admin/firebase-admin.service";
import { UsersService } from "./users/users.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly firebaseAdminService: FirebaseAdminService,
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

  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: UserLoginDto })
  @Post("login")
  async login(@Request() req) {
    return await this.authService.generateToken(req.user);
  }

  @Public()
  @Post("forgot-password")
  async forgotPassword(@Body("email") email: string) {
    return await this.authService.forgotPassword(email);
  }

  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const timestamp = new Date().getTime();
    const url = await this.firebaseAdminService.uploadFile(
      file,
      `${timestamp}-${file.originalname}`,
    );
    return { url };
  }

  // Views
  @Public()
  @Get("reset-password")
  @Render("reset-password")
  async resetPasswordPage(@Query("token") token: string) {
    return { token };
  }

  @Public()
  @Post("reset-password")
  @Render("reset-password-result")
  async resetPassword(
    @Body("token") token: string,
    @Body("password") password: string,
  ) {
    try {
      await this.authService.resetPassword(token, password);
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
