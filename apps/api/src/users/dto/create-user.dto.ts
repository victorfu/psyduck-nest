import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @Length(4, 20)
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @Length(4, 64)
  @ApiProperty()
  password: string;

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
  @ApiProperty()
  roles?: string[];

  @IsOptional()
  @IsString()
  @ApiProperty()
  picture?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isActive?: boolean;
}
