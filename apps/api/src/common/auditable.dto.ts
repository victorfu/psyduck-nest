import { IsNumber, IsOptional } from "class-validator";

export class AuditableDto {
  @IsOptional()
  @IsNumber()
  createdBy?: number;

  @IsOptional()
  @IsNumber()
  updatedBy?: number;
}
