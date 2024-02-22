import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { LocalAuthGuard } from "./auth/local-auth.guard";
import { AuthService } from "./auth/auth.service";
import { Public } from "./decorators/public.decorator";
import { UserLoginDto } from "./auth/dto/user-login.dto";
import { ApiBearerAuth, ApiBody, ApiConsumes } from "@nestjs/swagger";
import { ChangePasswordDto } from "./auth/dto/change-password.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { FirebaseAdminService } from "./firebase-admin/firebase-admin.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
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

  @ApiBearerAuth()
  @Post("change-password")
  async changePassword(@Request() req, @Body() body: ChangePasswordDto) {
    return await this.authService.changePassword(req.user, body);
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
}
