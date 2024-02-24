import { Test, TestingModule } from "@nestjs/testing";
import { AccountService } from "./account.service";
import { UsersService } from "@/users/users.service";

describe("AccountService", () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: UsersService,
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
