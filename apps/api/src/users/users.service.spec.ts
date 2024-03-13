import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { MailerService } from "@/mailer/mailer.service";

const userArray = [
  {
    username: "user1",
    firstName: "firstName #1",
    lastName: "lastName #1",
  },
  {
    username: "user2",
    firstName: "firstName #2",
    lastName: "lastName #2",
  },
];

const oneUser = {
  username: "user1",
  firstName: "firstName #1",
  lastName: "lastName #1",
};

describe("UserService", () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn().mockResolvedValue(userArray),
            findOneBy: jest.fn().mockResolvedValue(oneUser),
            save: jest.fn().mockResolvedValue(oneUser),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === "bcrypt")
                return {
                  saltRounds: 10,
                };
              return null;
            }),
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create()", () => {
    it("should successfully insert a user", () => {
      const newUser = {
        username: "user1",
        password: "12345",
        firstName: "firstName #1",
        lastName: "lastName #1",
        createdBy: 1,
        updatedBy: 1,
      };

      const findOneBySpy = jest.spyOn(repository, "findOneBy");
      findOneBySpy.mockReturnValue(Promise.resolve(null));

      expect(service.create(newUser)).resolves.toEqual({
        username: "user1",
        firstName: "firstName #1",
        lastName: "lastName #1",
        createdBy: 1,
        updatedBy: 1,
      });
    });
  });

  describe("findAll()", () => {
    it("should return an array of users", async () => {
      const users = await service.findAll();
      expect(users).toEqual(userArray);
    });
  });

  describe("findOne()", () => {
    it("should get a single user", async () => {
      const repoSpy = jest.spyOn(repository, "findOneBy");
      const user = await service.findOne(1);
      expect(user).toEqual(oneUser);
      expect(repoSpy).toBeCalledWith({ id: 1 });
    });
  });

  describe("remove()", () => {
    it("should call remove with the passed value", async () => {
      const removeSpy = jest.spyOn(repository, "delete");
      const retVal = await service.remove(2);
      expect(removeSpy).toBeCalledWith(2);
      expect(retVal).toBeUndefined();
    });
  });
});
