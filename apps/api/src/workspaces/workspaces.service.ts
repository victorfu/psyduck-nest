import { Injectable } from "@nestjs/common";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Workspace } from "./entities/workspace.entity";
import { Repository } from "typeorm";

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspacesRepository: Repository<Workspace>,
  ) {}

  create(createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspacesRepository.save(createWorkspaceDto);
  }

  findAll() {
    return this.workspacesRepository.find();
  }

  findOne(id: number) {
    return this.workspacesRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        workspaceAccesses: true,
      },
    });
  }

  update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.workspacesRepository.update(id, updateWorkspaceDto);
  }

  remove(id: number) {
    this.workspacesRepository.delete(id);
  }
}
