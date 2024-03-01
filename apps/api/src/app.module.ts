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
import { AccountModule } from "./account/account.module";
import { WorkspacesModule } from "./workspaces/workspaces.module";
import { ClientsModule } from "./clients/clients.module";
import { OrganizationsModule } from "./organizations/organizations.module";
import { WorkspaceAccessModule } from "./workspace-access/workspace-access.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      // __dirname is dist when using npm start
      rootPath: join(__dirname, "../", "web", "dist"),
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
    AccountModule,
    WorkspacesModule,
    ClientsModule,
    OrganizationsModule,
    WorkspaceAccessModule,
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
