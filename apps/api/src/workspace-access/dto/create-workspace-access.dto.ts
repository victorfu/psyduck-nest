import { AuditableDto } from "@/common/auditable.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

class UserId {
  @ApiProperty()
  id: number;
}

class WorkspaceId {
  @ApiProperty()
  id: number;
}

export class CreateWorkspaceAccessDto extends AuditableDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  role: string;

  @IsNotEmpty()
  @ApiProperty()
  user: UserId;

  @IsNotEmpty()
  @ApiProperty()
  workspace: WorkspaceId;
}
