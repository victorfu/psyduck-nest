import { Module } from "@nestjs/common";
import { OrganizationsService } from "./organizations.service";
import { OrganizationsController } from "./organizations.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organization } from "./entities/organization.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
