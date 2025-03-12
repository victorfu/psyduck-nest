import { Injectable } from "@nestjs/common";
import { FirebaseAdminService } from "@/firebase-admin/firebase-admin.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Injectable()
export class UsersService {
  constructor(private readonly firebaseAdminService: FirebaseAdminService) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.firebaseAdminService.createUser(createUserDto);
    return user;
  }

  async getUser(uid: string) {
    const user = await this.firebaseAdminService.getUser(uid);
    return user;
  }

  async updateUser(uid: string, updateUserDto: UpdateUserDto) {
    const user = await this.firebaseAdminService.updateUser(uid, updateUserDto);
    return user;
  }

  async deleteUser(uid: string) {
    await this.firebaseAdminService.deleteUser(uid);
  }

  async listUsers(maxResults?: number, pageToken?: string) {
    return this.firebaseAdminService.listUsers(maxResults, pageToken);
  }

  async resetPassword(uid: string, resetPasswordDto: ResetPasswordDto) {
    await this.firebaseAdminService.resetPassword(
      uid,
      resetPasswordDto.password,
    );
  }
}
