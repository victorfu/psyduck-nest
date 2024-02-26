import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthService } from "./auth/auth.service";
import { FirebaseAdminService } from "./firebase-admin/firebase-admin.service";
import { UsersService } from "./users/users.service";

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
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({ access_token: "token" }),
          },
        },
        {
          provide: FirebaseAdminService,
          useValue: {
            uploadFile: jest.fn().mockResolvedValue("url"),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue({}),
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
