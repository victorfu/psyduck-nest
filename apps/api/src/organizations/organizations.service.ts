import { Injectable } from "@nestjs/common";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Organization } from "./entities/organization.entity";

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationsRepository: Repository<Organization>,
  ) {}

  create(createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsRepository.save(createOrganizationDto);
  }

  findAll() {
    return this.organizationsRepository.find();
  }

  findOne(id: number) {
    return this.organizationsRepository.findOneBy({ id: id });
  }

  update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationsRepository.update(id, updateOrganizationDto);
  }

  remove(id: number) {
    return this.organizationsRepository.delete(id);
  }
}
