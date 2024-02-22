import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./config/configuration";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { TerminusModule } from "@nestjs/terminus";
import { HealthModule } from "./health/health.module";
import { AuthModule } from "./auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { RolesGuard } from "./auth/roles.guard";
import { EventsModule } from "./events/events.module";
import { FirebaseAdminModule } from "./firebase-admin/firebase-admin.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      // __dirname is dist when using npm start
      rootPath: join(__dirname, "../", "web", "dist"),
      exclude: ["/api/(.*)"],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get("db"),
      inject: [ConfigService],
    }),
    TerminusModule,
    HealthModule,
    UsersModule,
    AuthModule,
    EventsModule,
    FirebaseAdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
