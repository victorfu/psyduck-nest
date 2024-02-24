import { Test, TestingModule } from "@nestjs/testing";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";
import { AuthService } from "@/auth/auth.service";
import { UsersService } from "@/users/users.service";

describe("AccountController", () => {
  let controller: AccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        AccountService,
        {
          provide: UsersService,
          useValue: {},
        },
        {
          provide: AuthService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
