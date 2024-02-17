import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(4, 20)
  username: string;

  @IsNotEmpty()
  @Length(4, 64)
  password: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  roles?: string[];
}
