import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class CreateUserDto {
  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  emailVerified?: boolean;

  @IsOptional()
  @Length(8, 20)
  @ApiProperty()
  password?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  displayName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  photoURL?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  disabled?: boolean;
}
