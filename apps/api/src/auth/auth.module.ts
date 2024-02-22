import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtConfig } from "../config/configuration.interface";
import { JwtStrategy } from "./jwt.strategy";
import { AuthController } from "./auth.controller";
import { GoogleStrategy } from "./google.strategy";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const jwtConfig = configService.get<JwtConfig>("jwt");
        return {
          secret: jwtConfig.secret,
          signOptions: { expiresIn: jwtConfig.expiresIn },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
