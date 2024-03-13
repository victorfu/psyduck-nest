import { Injectable } from "@nestjs/common";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Note } from "./entities/note.entity";
import { Repository } from "typeorm";

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly notesRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto) {
    return await this.notesRepository.save(createNoteDto);
  }

  async findAll() {
    return await this.notesRepository.find();
  }

  async findOne(id: number) {
    return await this.notesRepository.findOneBy({ id: id });
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    return await this.notesRepository.update(id, updateNoteDto);
  }

  async remove(id: number) {
    await this.notesRepository.delete(id);
  }
}
