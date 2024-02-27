import {
  Controller,
  Get,
  Body,
  Patch,
  Request,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { AccountService } from "./account.service";
import { UpdateAccountDto } from "./dto/update-account.dto";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ChangePasswordDto } from "@/auth/dto/change-password.dto";
import { SetLocalPasswordDto } from "@/auth/dto/set-local-password.dto";
import { AuthService } from "@/auth/auth.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { FirebaseAdminService } from "@/firebase-admin/firebase-admin.service";

@ApiTags("account")
@Controller("account")
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly authService: AuthService,
    private readonly firebaseAdminService: FirebaseAdminService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
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
  @Post("picture")
  @UseInterceptors(FileInterceptor("file"))
  async picture(@Request() req, @UploadedFile() file: Express.Multer.File) {
    const timestamp = new Date().getTime();
    const url = await this.firebaseAdminService.uploadFile(
      file,
      `${timestamp}.${file.originalname.split(".").pop()}`,
    );
    await this.accountService.update(req.user.id, { picture: url });
    return { url };
  }
}
