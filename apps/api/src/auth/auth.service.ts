import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { SetLocalPasswordDto } from "./dto/set-local-password.dto";
import { User } from "@/users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private removeSensitiveData(user: User) {
    const result = { ...user };
    delete result.password;
    delete result.emailVerificationToken;
    delete result.passwordResetToken;
    delete result.passwordResetTokenExpiration;
    return result;
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (
      user &&
      (await bcrypt.compare(pass, user.password)) &&
      user.isActive === true
    ) {
      return this.removeSensitiveData(user);
    }
    return null;
  }

  async validateToken(token: any): Promise<any> {
    const { sub: username } = token;
    const user = await this.usersService.findOneByUsername(username);
    if (user && user.isActive === true) {
      return this.removeSensitiveData(user);
    }
    return null;
  }

  async validateGoogleUser(profile: any): Promise<any> {
    const { emails, photos, name } = profile;
    const user = await this.usersService.findOneByEmail(emails[0].value);
    if (user) {
      await this.usersService.update(user.id, {
        picture: photos[0].value,
        emailVerified: true,
        oauthGoogleRaw: profile._raw,
      });
      return this.removeSensitiveData(user);
    }
    const newUser = await this.usersService.create({
      username: emails[0].value,
      email: emails[0].value,
      emailVerified: true,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      isActive: true,
      oauthGoogleRaw: profile._raw,
      createdBy: 0,
      updatedBy: 0,
    });
    return this.removeSensitiveData(newUser);
  }

  generateToken(user: any) {
    const payload = {
      sub: user.username,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async changePassword(user: any, changePasswordDto: ChangePasswordDto) {
    const userEntity = await this.usersService.findOneByUsername(user.username);
    if (!userEntity) {
      throw new NotFoundException("User not found");
    }

    const { currentPassword, newPassword } = changePasswordDto;
    if (!(await bcrypt.compare(currentPassword, userEntity.password))) {
      throw new BadRequestException("Invalid password");
    }

    // check if the new password is the same as the old password
    if (await bcrypt.compare(newPassword, userEntity.password)) {
      throw new BadRequestException("New password must be different");
    }

    await this.usersService.update(userEntity.id, { password: newPassword });
    return { message: "Password updated" };
  }

  async setLocalPassword(user: any, setLocalPasswordDto: SetLocalPasswordDto) {
    const userEntity = await this.usersService.findOneByUsername(user.username);
    if (!userEntity) {
      throw new NotFoundException("User not found");
    }

    if (!userEntity.oauthGoogleRaw) {
      throw new BadRequestException("Only Google OAuth users can set password");
    }

    await this.usersService.update(userEntity.id, {
      password: setLocalPasswordDto.newPassword,
    });
    return { message: "Password set" };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      return;
    }
    return this.usersService.sendPasswordResetEmail(user);
  }

  async resetPassword(token: string, newPassword: string) {
    return this.usersService.resetPassword(token, newPassword);
  }
}
