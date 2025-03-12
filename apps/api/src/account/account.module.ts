import { Module } from "@nestjs/common";
import { AccountService } from "./account.service";
import { AccountController } from "./account.controller";
import { AuthModule } from "@/auth/auth.module";
import { FirebaseAdminModule } from "@/firebase-admin/firebase-admin.module";

@Module({
  imports: [AuthModule, FirebaseAdminModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
