import { PartialType } from "@nestjs/swagger";
import { CreateWorkspaceAccessDto } from "./create-workspace-access.dto";

export class UpdateWorkspaceAccessDto extends PartialType(
  CreateWorkspaceAccessDto,
) {}
