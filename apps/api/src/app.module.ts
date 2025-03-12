import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { UsersModule } from "./users/users.module";
import { TerminusModule } from "@nestjs/terminus";
import { HealthModule } from "./health/health.module";
import { AuthModule } from "./auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./auth/roles.guard";
import { EventsModule } from "./events/events.module";
import { FirebaseAdminModule } from "./firebase-admin/firebase-admin.module";
import { AccountModule } from "./account/account.module";
import { LineSdkModule } from "./line-sdk/line-sdk.module";
import { FirebaseGuard } from "./auth/firebase.guard";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { WorkspacesModule } from "./workspaces/workspaces.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      // __dirname is dist when using npm start
      rootPath: join(__dirname, "./web"),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TerminusModule,
    HealthModule,
    UsersModule,
    AuthModule,
    EventsModule,
    FirebaseAdminModule,
    AccountModule,
    LineSdkModule,
    WorkspacesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: FirebaseGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
