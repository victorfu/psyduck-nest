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

  async create(createOrganizationDto: CreateOrganizationDto) {
    return await this.organizationsRepository.save(createOrganizationDto);
  }

  async findAll() {
    return await this.organizationsRepository.find();
  }

  async findOne(id: number) {
    return await this.organizationsRepository.findOneBy({ id: id });
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    return await this.organizationsRepository.update(id, updateOrganizationDto);
  }

  async remove(id: number) {
    await this.organizationsRepository.delete(id);
  }
}
