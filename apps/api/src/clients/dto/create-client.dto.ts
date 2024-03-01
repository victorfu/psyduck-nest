import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateClientDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  note?: string;
}
