import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AppService } from "../app.service";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AppService,
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: UsersService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
