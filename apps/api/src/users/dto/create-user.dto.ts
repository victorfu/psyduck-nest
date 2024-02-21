import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, Length } from "class-validator";

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
  @ApiProperty()
  firstName?: string;

  @IsOptional()
  @ApiProperty()
  lastName?: string;

  @IsOptional()
  @ApiProperty()
  roles?: string[];

  @IsOptional()
  @ApiProperty()
  isActive?: boolean;
}
