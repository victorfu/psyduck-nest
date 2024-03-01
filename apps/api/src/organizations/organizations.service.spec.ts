import { Test, TestingModule } from "@nestjs/testing";
import { OrganizationsService } from "./organizations.service";
import { Organization } from "./entities/organization.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("OrganizationsService", () => {
  let service: OrganizationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        {
          provide: getRepositoryToken(Organization),
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

    service = module.get<OrganizationsService>(OrganizationsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
