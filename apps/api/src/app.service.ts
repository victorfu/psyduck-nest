import { Injectable } from "@nestjs/common";
import { getPackageVersion } from "./utils";

@Injectable()
export class AppService {
  date(): { date: string } {
    return {
      date: new Date().toISOString(),
    };
  }

  version(): { version: string } {
    return getPackageVersion();
  }
}
