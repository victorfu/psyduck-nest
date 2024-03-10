import { Test, TestingModule } from "@nestjs/testing";
import { NotesController } from "./notes.controller";
import { NotesService } from "./notes.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Note } from "./entities/note.entity";

describe("NotesController", () => {
  let controller: NotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(Note),
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

    controller = module.get<NotesController>(NotesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
