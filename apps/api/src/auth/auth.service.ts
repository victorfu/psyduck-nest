import { Injectable } from "@nestjs/common";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { FirebaseAdminService } from "@/firebase-admin/firebase-admin.service";
@Injectable()
export class AuthService {
  constructor(private firebaseAdminService: FirebaseAdminService) {}

  async validateToken(token: string): Promise<any> {
    try {
      const decodedToken = await this.firebaseAdminService.verifyIdToken(token);
      const uid = decodedToken.uid;
      const user = await this.firebaseAdminService.getUser(uid);
      return user;
    } catch (error) {
      return null;
    }
  }

  async changePassword(uid: string, changePasswordDto: ChangePasswordDto) {
    const { newPassword } = changePasswordDto;
    await this.firebaseAdminService.updateUser(uid, {
      password: newPassword,
    });
    return { message: "Password updated" };
  }
}
