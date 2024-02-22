import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { ChangePasswordDto } from "./dto/change-password.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (
      user &&
      (await bcrypt.compare(pass, user.password)) &&
      user.isActive === true
    ) {
      const result = { ...user };
      delete result.password;
      return result;
    }
    return null;
  }

  async validateToken(token: any): Promise<any> {
    const { sub: username } = token;
    const user = await this.usersService.findOneByUsername(username);
    if (user && user.isActive === true) {
      const result = { ...user };
      delete result.password;
      return result;
    }
    return null;
  }

  async login(user: any) {
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
}
