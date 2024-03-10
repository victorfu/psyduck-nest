import { Injectable } from "@nestjs/common";
import { CreateWorkspaceAccessDto } from "./dto/create-workspace-access.dto";
import { UpdateWorkspaceAccessDto } from "./dto/update-workspace-access.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkspaceAccess } from "./entities/workspace-access.entity";
import { Repository } from "typeorm";

@Injectable()
export class WorkspaceAccessService {
  constructor(
    @InjectRepository(WorkspaceAccess)
    private readonly workspaceAccessRepository: Repository<WorkspaceAccess>,
  ) {}

  create(createWorkspaceAccessDto: CreateWorkspaceAccessDto) {
    return this.workspaceAccessRepository.save(createWorkspaceAccessDto);
  }

  findAll() {
    return this.workspaceAccessRepository.find();
  }

  findAllByWorkspaceId(workspaceId: number) {
    return this.workspaceAccessRepository.find({
      where: {
        workspace: {
          id: workspaceId,
        },
      },
    });
  }

  findOne(id: number) {
    return this.workspaceAccessRepository.findOneBy({ id: id });
  }

  update(id: number, updateWorkspaceAccessDto: UpdateWorkspaceAccessDto) {
    return this.workspaceAccessRepository.update(id, updateWorkspaceAccessDto);
  }

  remove(id: number) {
    this.workspaceAccessRepository.delete(id);
  }
}
