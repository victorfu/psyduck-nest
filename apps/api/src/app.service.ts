import { Injectable } from "@nestjs/common";
import { getPackageVersion } from "./utils";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  date(): { date: string } {
    return {
      date: new Date().toISOString(),
    };
  }

  env(): { env: string } {
    const env = this.configService.get<string>("env");
    return {
      env: env,
    };
  }

  version(): { version: string } {
    return getPackageVersion();
  }
}
