import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserManagementController } from "./user-management.controller";
import { FirebaseAdminModule } from "@/firebase-admin/firebase-admin.module";
import { UsersController } from "./users.controller";
@Module({
  imports: [FirebaseAdminModule],
  controllers: [UserManagementController, UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
