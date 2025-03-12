import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateAccountDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  disabled?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty()
  displayName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  phoneNumber?: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty()
  photoURL?: string;
}
