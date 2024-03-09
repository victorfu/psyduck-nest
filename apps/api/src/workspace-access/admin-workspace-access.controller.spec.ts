import { Test, TestingModule } from "@nestjs/testing";
import { AdminWorkspaceAccessController } from "./admin-workspace-access.controller";
import { WorkspaceAccessService } from "./workspace-access.service";
import { WorkspaceAccess } from "./entities/workspace-access.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("WorkspaceAccessController", () => {
  let controller: AdminWorkspaceAccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminWorkspaceAccessController],
      providers: [
        WorkspaceAccessService,
        {
          provide: getRepositoryToken(WorkspaceAccess),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            findOneBy: jest.fn().mockResolvedValue({}),
            save: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue({}),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminWorkspaceAccessController>(
      AdminWorkspaceAccessController,
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
