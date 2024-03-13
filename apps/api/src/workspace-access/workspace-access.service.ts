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

  async create(createWorkspaceAccessDto: CreateWorkspaceAccessDto) {
    return await this.workspaceAccessRepository.save(createWorkspaceAccessDto);
  }

  async findAll() {
    return await this.workspaceAccessRepository.find();
  }

  async findAllByWorkspaceId(workspaceId: number) {
    return await this.workspaceAccessRepository.find({
      where: {
        workspace: {
          id: workspaceId,
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.workspaceAccessRepository.findOneBy({ id: id });
  }

  async update(id: number, updateWorkspaceAccessDto: UpdateWorkspaceAccessDto) {
    return await this.workspaceAccessRepository.update(
      id,
      updateWorkspaceAccessDto,
    );
  }

  async remove(id: number) {
    await this.workspaceAccessRepository.delete(id);
  }
}
