import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateOrganizationDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;
}
