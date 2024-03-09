import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @ApiProperty()
  birthday?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  language?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  emailVerificationToken?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  passwordResetToken?: string;

  @IsOptional()
  @ApiProperty()
  passwordResetTokenExpiration?: Date;
}
