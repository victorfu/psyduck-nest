import { Test, TestingModule } from "@nestjs/testing";
import { ClientsService } from "./clients.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Client } from "./entities/client.entity";

describe("ClientsService", () => {
  let service: ClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
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

    service = module.get<ClientsService>(ClientsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
