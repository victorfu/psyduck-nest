import { Test, TestingModule } from "@nestjs/testing";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

const userA = {
  id: 1,
  username: "user-0",
  password: "123",
  firstName: "firstName #1",
  lastName: "lastName #1",
};

const createUserDto: CreateUserDto = {
  username: "user-1",
  password: "123",
  firstName: "firstName #1",
  lastName: "lastName #1",
};

describe("UsersController", () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UsersService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((user: CreateUserDto) =>
                Promise.resolve({ id: 1, ...user }),
              ),
            findAll: jest.fn().mockResolvedValue([
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
            ]),
            findAllByUsername: jest.fn().mockResolvedValue([
              {
                username: "user1",
                firstName: "firstName #1",
                lastName: "lastName #1",
              },
            ]),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                username: "user1",
                firstName: "firstName #1",
                lastName: "lastName #1",
                id,
              }),
            ),
            findOneByUsername: jest.fn().mockResolvedValue({
              username: "user1",
              firstName: "firstName #1",
              lastName: "lastName #1",
            }),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
    usersService = app.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(usersController).toBeDefined();
  });

  describe("create()", () => {
    it("should create a user", async () => {
      usersController.create(
        {
          user: userA,
        },
        createUserDto,
      );
      expect(
        usersController.create(
          {
            user: userA,
          },
          createUserDto,
        ),
      ).resolves.toEqual({
        id: 1,
        ...createUserDto,
      });
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe("findAll()", () => {
    it("should find all users ", () => {
      usersController.findAll("user1");
      expect(usersService.findAllByUsername).toHaveBeenCalled();
    });
  });

  describe("findOne()", () => {
    it("should find a user", () => {
      expect(usersController.findOne("1")).resolves.toEqual({
        username: "user1",
        firstName: "firstName #1",
        lastName: "lastName #1",
        id: 1,
      });
      expect(usersService.findOne).toHaveBeenCalled();
    });
  });

  describe("remove()", () => {
    it("should remove the user", () => {
      usersController.remove("2");
      expect(usersService.remove).toHaveBeenCalled();
    });
  });
});
