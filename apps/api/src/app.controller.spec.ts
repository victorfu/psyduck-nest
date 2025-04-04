import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            date: jest.fn().mockResolvedValue(new Date()),
            env: jest.fn().mockResolvedValue({}),
            version: jest.fn().mockResolvedValue("1.0.0"),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    it("should return version", () => {
      expect(appController.version()).not.toBeNull();
    });
  });
});
