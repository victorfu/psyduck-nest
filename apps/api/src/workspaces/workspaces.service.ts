import { Injectable } from "@nestjs/common";
import { FirebaseAdminService } from "@/firebase-admin/firebase-admin.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class WorkspacesService {
  constructor(
    private readonly firebaseAdminService: FirebaseAdminService,
    private readonly configService: ConfigService,
  ) {}

  async findTeamMembers(id: string) {
    const teamMembers = await this.firebaseAdminService.findTeamMembers(id);
    return teamMembers;
  }

  async findCpWorkspaces() {
    const workspaceApiUrl = this.configService.get("cp.workspaceApiUrl");
    const workspaceApiKey = this.configService.get("cp.workspaceApiKey");
    const response = await fetch(workspaceApiUrl, {
      headers: {
        "x-api-key": workspaceApiKey,
      },
    });
    return response.json();
  }
}
