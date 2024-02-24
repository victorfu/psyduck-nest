import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class SetLocalPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Length(4, 20)
  readonly newPassword: string;
}
