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

  createByUserId(userId: number, createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspacesRepository.save({
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

  findAll() {
    return this.workspacesRepository.find();
  }

  findAllByUserId(userId: number) {
    return this.workspacesRepository.find({
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

  findOneByUserId(workspaceId: number, userId: number) {
    return this.workspacesRepository.findOne({
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

  update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.workspacesRepository.update(id, updateWorkspaceDto);
  }

  updateByUserId(
    id: number,
    userId: number,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspacesRepository.update(
      {
        id: id,
        workspaceAccesses: {
          user: {
            id: userId,
          },
        },
      },
      updateWorkspaceDto,
    );
  }

  remove(id: number) {
    this.workspacesRepository.delete(id);
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
    this.workspacesRepository.remove(workspace);
  }
}
