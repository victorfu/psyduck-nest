import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";
import { User } from "../entities/user.entity";

export class CreateUserDto {
  @IsNotEmpty()
  @Length(4, 20)
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @Length(4, 20)
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

  @IsOptional()
  @IsString()
  @ApiProperty()
  oauthGoogleRaw?: string;

  public static async toUser(dto: CreateUserDto) {
    const user = new User();
    user.username = dto.username;
    user.password = dto.password;
    user.email = dto.email;
    user.emailVerified = dto.emailVerified;
    user.firstName = dto.firstName;
    user.lastName = dto.lastName;
    user.roles = dto.roles;
    user.picture = dto.picture;
    user.isActive = dto.isActive;
    user.oauthGoogleRaw = dto.oauthGoogleRaw;
    return user;
  }
}
