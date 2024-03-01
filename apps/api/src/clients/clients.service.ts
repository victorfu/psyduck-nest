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

  create(createClientDto: CreateClientDto) {
    return this.clientsRepository.save(createClientDto);
  }

  findAll() {
    return this.clientsRepository.find();
  }

  findOne(id: number) {
    return this.clientsRepository.findOneBy({ id: id });
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return this.clientsRepository.update(id, updateClientDto);
  }

  async remove(id: number) {
    await this.clientsRepository.delete(id);
  }
}
