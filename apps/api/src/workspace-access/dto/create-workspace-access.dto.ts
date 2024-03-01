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

export class CreateWorkspaceAccessDto {
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
