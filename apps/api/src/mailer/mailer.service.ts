import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NodemailerConfig } from "src/config/configuration.interface";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const nodemailerConfig = configService.get<NodemailerConfig>("nodemailer");

    this.transporter = nodemailer.createTransport({
      service: nodemailerConfig.service,
      auth: {
        user: nodemailerConfig.user,
        pass: nodemailerConfig.pass,
      },
    });
  }

  async sendMail({
    from,
    to,
    subject,
    text,
    html,
  }: {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<void> {
    await this.transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
  }
}
