import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  @Length(8, 20)
  @ApiProperty()
  password: string;
}
