import { Test, TestingModule } from "@nestjs/testing";
import { WorkspacesService } from "./workspaces.service";
import { Workspace } from "./entities/workspace.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("WorkspacesService", () => {
  let service: WorkspacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspacesService,
        {
          provide: getRepositoryToken(Workspace),
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

    service = module.get<WorkspacesService>(WorkspacesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
