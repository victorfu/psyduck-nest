import { Controller, Get, Request, Response, UseGuards } from "@nestjs/common";
import { GoogleOauthGuard } from "./google-auth.guard";
import { Public } from "../decorators/public.decorator";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Get("google")
  @UseGuards(GoogleOauthGuard)
  googleLogin() {}

  @Public()
  @Get("google/callback")
  @UseGuards(GoogleOauthGuard)
  googleLoginCallback(@Request() req, @Response() res) {
    const user = req.user;
    const { access_token: accessToken } = this.authService.generateToken(user);
    const env = this.configService.get<string>("env");
    res.cookie("access_token", accessToken, {
      // httpOnly: true,
      Secure: env === "production" ? true : false,
      SameSite: true,
    });
    res.redirect("/auth/google/success");
  }
}
