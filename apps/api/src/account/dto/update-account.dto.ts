import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateAccountDto {
  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  emailVerified?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty()
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  lastName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  picture?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  birthday?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  language?: string;
}
