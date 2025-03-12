import { Injectable } from "@nestjs/common";
import { FirebaseAdminService } from "@/firebase-admin/firebase-admin.service";
import { UpdateRequest } from "firebase-admin/auth";

@Injectable()
export class AccountService {
  constructor(private readonly firebaseAdminService: FirebaseAdminService) {}

  async update(uid: string, properties: UpdateRequest) {
    await this.firebaseAdminService.updateUser(uid, properties);
  }
}
