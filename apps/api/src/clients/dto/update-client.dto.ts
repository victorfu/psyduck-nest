import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateClientDto } from "./create-client.dto";
import { IsOptional, IsString } from "class-validator";

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @IsOptional()
  @IsString()
  @ApiProperty()
  birthday?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  address?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  gender?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  height?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  weight?: number;
}
