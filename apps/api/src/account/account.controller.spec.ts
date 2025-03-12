import { Test, TestingModule } from "@nestjs/testing";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";
import { AuthService } from "@/auth/auth.service";
import { FirebaseAdminService } from "@/firebase-admin/firebase-admin.service";

describe("AccountController", () => {
  let controller: AccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        AccountService,
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: FirebaseAdminService,
          useValue: {
            uploadFile: jest.fn().mockResolvedValue("url"),
          },
        },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
