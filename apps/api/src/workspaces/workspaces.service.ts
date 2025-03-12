import { Injectable } from "@nestjs/common";
import { FirebaseAdminService } from "@/firebase-admin/firebase-admin.service";

@Injectable()
export class WorkspacesService {
  constructor(private readonly firebaseAdminService: FirebaseAdminService) {}

  async findTeamMembers(id: string) {
    const teamMembers = await this.firebaseAdminService.findTeamMembers(id);
    return teamMembers;
  }
}
