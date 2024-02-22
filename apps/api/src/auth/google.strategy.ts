import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OauthConfig } from "@/config/configuration.interface";
import { AuthService } from "./auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const oauthConfig = configService.get<OauthConfig>("oauth");
    super({
      clientID: oauthConfig.google.clientId,
      clientSecret: oauthConfig.google.clientSecret,
      callbackURL: oauthConfig.google.redirectUrl,
      scope: ["email", "profile"],
    });
  }

  // make sure to add this or else you won't get the refresh token
  authorizationParams(): { [key: string]: string } {
    return {
      access_type: "offline",
      prompt: "consent",
    };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const user = await this.authService.validateGoogleUser(profile);
    done(null, user);
  }
}
