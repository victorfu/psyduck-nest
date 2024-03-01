import { Test, TestingModule } from "@nestjs/testing";
import { ClientsController } from "./clients.controller";
import { ClientsService } from "./clients.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Client } from "./entities/client.entity";

describe("ClientsController", () => {
  let controller: ClientsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
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

    controller = module.get<ClientsController>(ClientsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
