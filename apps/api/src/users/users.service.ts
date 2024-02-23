import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import {
  BcryptConfig,
  DefaultUserConfig,
} from "../config/configuration.interface";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const found = await this.findOneByUsername(createUserDto.username);
    if (found) {
      throw new ConflictException("Username already exists");
    }

    const bcryptConfig = this.configService.get<BcryptConfig>("bcrypt");
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      bcryptConfig.saltRounds,
    );
    const user = await CreateUserDto.toUser(createUserDto);
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id: id });
  }

  findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username: username });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email: email });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.username) {
      const found = await this.findOneByUsername(updateUserDto.username);
      if (found && found.id !== id) {
        throw new ConflictException("Username already exists");
      }
    }
    if (updateUserDto.email) {
      const found = await this.findOneByEmail(updateUserDto.email);
      if (found && found.id !== id) {
        throw new ConflictException("Email already exists");
      }

      updateUserDto.emailVerified = false;
      if (updateUserDto.oauthGoogleRaw) {
        throw new BadRequestException(
          "Cannot update email for Google OAuth user",
        );
      }
    }
    if (updateUserDto.password) {
      const bcryptConfig = this.configService.get<BcryptConfig>("bcrypt");
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        bcryptConfig.saltRounds,
      );
    }
    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async resetPassword(id: number) {
    const bcryptConfig = this.configService.get<BcryptConfig>("bcrypt");
    const { defaultPassword } =
      this.configService.get<DefaultUserConfig>("user");
    return this.usersRepository.update(id, {
      password: await bcrypt.hash(defaultPassword, bcryptConfig.saltRounds),
    });
  }

  async initializeDefaultAdmin() {
    const userCount = await this.usersRepository.count();
    if (userCount === 0) {
      const defaultAdmin = this.configService.get("defaultAdmin");
      await this.create(defaultAdmin).catch((error) => {
        console.error("Failed to create default admin user:", error);
      });
    }
  }
}
