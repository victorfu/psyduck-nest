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

  async create(createWorkspaceDto: CreateWorkspaceDto) {
    return await this.workspacesRepository.save(createWorkspaceDto);
  }

  async createByUserId(userId: number, createWorkspaceDto: CreateWorkspaceDto) {
    return await this.workspacesRepository.save({
      ...createWorkspaceDto,
      workspaceAccesses: [
        {
          role: "write",
          user: {
            id: userId,
          },
        },
      ],
    });
  }

  async findAll() {
    return await this.workspacesRepository.find();
  }

  async findAllByUserId(userId: number) {
    return await this.workspacesRepository.find({
      where: {
        workspaceAccesses: {
          user: {
            id: userId,
          },
        },
      },
      relations: {
        workspaceAccesses: false,
      },
    });
  }

  async findOne(id: number) {
    return await this.workspacesRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        workspaceAccesses: true,
      },
    });
  }

  async findOneByUserId(workspaceId: number, userId: number) {
    return await this.workspacesRepository.findOne({
      where: {
        id: workspaceId,
        workspaceAccesses: {
          user: {
            id: userId,
          },
        },
      },
      relations: {
        workspaceAccesses: false,
      },
    });
  }

  async update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    return await this.workspacesRepository.update(id, updateWorkspaceDto);
  }

  async remove(id: number) {
    await this.workspacesRepository.delete(id);
  }

  async removeByUserId(id: number, userId: number) {
    const workspace = await this.workspacesRepository.findOne({
      where: {
        id: id,
        workspaceAccesses: {
          user: {
            id: userId,
          },
        },
      },
    });
    if (!workspace) {
      return;
    }
    await this.workspacesRepository.remove(workspace);
  }
}
