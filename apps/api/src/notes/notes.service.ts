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

  create(createNoteDto: CreateNoteDto) {
    return this.notesRepository.save(createNoteDto);
  }

  findAll() {
    return this.notesRepository.find();
  }

  findOne(id: number) {
    return this.notesRepository.findOneBy({ id: id });
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return this.notesRepository.update(id, updateNoteDto);
  }

  async remove(id: number) {
    await this.notesRepository.delete(id);
  }
}
