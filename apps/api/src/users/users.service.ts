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
  NodemailerConfig,
  ServerConfig,
} from "../config/configuration.interface";
import { MailerService } from "@/mailer/mailer.service";
import * as crypto from "crypto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const found = await this.findOneByUsername(createUserDto.username);
    if (found) {
      throw new ConflictException("Username already exists");
    }

    const bcryptConfig = this.configService.get<BcryptConfig>("bcrypt");
    if (createUserDto.password) {
      createUserDto.password = await bcrypt.hash(
        createUserDto.password,
        bcryptConfig.saltRounds,
      );
    }
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

  async setDefaultPassword(id: number) {
    const bcryptConfig = this.configService.get<BcryptConfig>("bcrypt");
    const { defaultPassword } =
      this.configService.get<DefaultUserConfig>("user");
    return this.usersRepository.update(id, {
      password: await bcrypt.hash(defaultPassword, bcryptConfig.saltRounds),
    });
  }

  async hasLocalAuth(id: number): Promise<boolean> {
    const user = await this.usersRepository.findOneBy({ id: id });
    return !!user.password;
  }

  async sendVerificationEmail(user: User) {
    const mailerConfig = this.configService.get<NodemailerConfig>("nodemailer");
    const appUrl = this.configService.get<ServerConfig>("appUrl");

    const verificationToken = crypto.randomBytes(16).toString("hex");
    await this.update(user.id, { emailVerificationToken: verificationToken });

    const verificationUrl = `${appUrl}/verify-email?token=${verificationToken}`;
    await this.mailerService.sendMail({
      from: mailerConfig.user,
      to: user.email,
      subject: "Verify Your Email",
      text: `Please click this link to verify your email: ${verificationUrl}`,
      html: `Please click this link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`,
    });
  }

  async sendPasswordResetEmail(user: User) {
    const mailerConfig = this.configService.get<NodemailerConfig>("nodemailer");
    const appUrl = this.configService.get<ServerConfig>("appUrl");

    const resetToken = crypto.randomBytes(16).toString("hex");
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 10);
    await this.update(user.id, {
      passwordResetToken: resetToken,
      passwordResetTokenExpiration: expirationDate,
    });

    const resetUrl = `${appUrl}/reset-password?token=${resetToken}`;
    await this.mailerService.sendMail({
      from: mailerConfig.user,
      to: user.email,
      subject: "Reset Your Password",
      text: `Please click this link to reset your password: ${resetUrl}`,
      html: `Please click this link to reset your password: <a href="${resetUrl}">${resetUrl}</a>`,
    });
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersRepository.findOneBy({
      passwordResetToken: token,
    });

    if (!user || user.passwordResetTokenExpiration < new Date()) {
      throw new BadRequestException("Invalid or expired token");
    }

    return this.update(user.id, {
      password: newPassword,
      passwordResetToken: null,
      passwordResetTokenExpiration: null,
    });
  }

  async verifyEmail(token: string) {
    if (!token) {
      throw new BadRequestException("Token is required");
    }
    const user = await this.usersRepository.findOneBy({
      emailVerificationToken: token,
    });
    if (!user) {
      throw new Error("User not found or token is invalid");
    }

    return this.update(user.id, {
      emailVerified: true,
      emailVerificationToken: null,
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
