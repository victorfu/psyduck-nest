import { Module } from "@nestjs/common";
import { AccountService } from "./account.service";
import { AccountController } from "./account.controller";
import { UsersModule } from "@/users/users.module";
import { AuthModule } from "@/auth/auth.module";
import { FirebaseAdminModule } from "@/firebase-admin/firebase-admin.module";

@Module({
  imports: [UsersModule, AuthModule, FirebaseAdminModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
