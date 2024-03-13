import { Injectable } from "@nestjs/common";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Client } from "./entities/client.entity";
import { Repository } from "typeorm";

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    return await this.clientsRepository.save(createClientDto);
  }

  async findAll() {
    return await this.clientsRepository.find();
  }

  async findOne(id: number) {
    return await this.clientsRepository.findOneBy({ id: id });
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    return await this.clientsRepository.update(id, updateClientDto);
  }

  async remove(id: number) {
    await this.clientsRepository.delete(id);
  }
}
