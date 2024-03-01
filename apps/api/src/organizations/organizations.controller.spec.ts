import { Test, TestingModule } from "@nestjs/testing";
import { OrganizationsController } from "./organizations.controller";
import { OrganizationsService } from "./organizations.service";
import { Organization } from "./entities/organization.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("OrganizationsController", () => {
  let controller: OrganizationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationsController],
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

    controller = module.get<OrganizationsController>(OrganizationsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
