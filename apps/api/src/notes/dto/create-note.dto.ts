import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateNoteDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  content?: string;
}
