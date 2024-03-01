import { Test, TestingModule } from "@nestjs/testing";
import { WorkspaceAccessService } from "./workspace-access.service";
import { WorkspaceAccess } from "./entities/workspace-access.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("WorkspaceAccessService", () => {
  let service: WorkspaceAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<WorkspaceAccessService>(WorkspaceAccessService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
