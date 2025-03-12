import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { FirebaseAdminModule } from "@/firebase-admin/firebase-admin.module";
@Module({
  imports: [UsersModule, PassportModule, FirebaseAdminModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
