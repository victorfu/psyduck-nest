import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Render,
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

  @ApiExcludeEndpoint()
  @ApiTags("auth")
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: UserLoginDto })
  @Post("login")
  async login(@Request() req) {
    return await this.authService.generateToken(req.user);
  }

  // Views

  @ApiExcludeEndpoint()
  @Public()
  @Get("ssr")
  @Render("ssr")
  async ssr() {
    return { message: "Hello SSR!" };
  }
}
