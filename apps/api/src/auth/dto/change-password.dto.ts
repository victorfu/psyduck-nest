import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Length(8, 20)
  readonly currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Length(8, 20)
  readonly newPassword: string;
}
