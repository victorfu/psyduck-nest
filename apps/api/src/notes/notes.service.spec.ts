import { Test, TestingModule } from "@nestjs/testing";
import { NotesService } from "./notes.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Note } from "./entities/note.entity";

describe("NotesService", () => {
  let service: NotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<NotesService>(NotesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
