import { Test, TestingModule } from "@nestjs/testing";
import { AccountService } from "./account.service";
import { FirebaseAdminService } from "@/firebase-admin/firebase-admin.service";

describe("AccountService", () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: FirebaseAdminService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
