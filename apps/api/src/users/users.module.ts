import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { FirebaseAdminModule } from "@/firebase-admin/firebase-admin.module";

@Module({
  imports: [FirebaseAdminModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
