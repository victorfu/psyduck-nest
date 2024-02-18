import { Injectable } from "@nestjs/common";
import { getPackageVersion } from "./utils";

@Injectable()
export class AppService {
  time(): string {
    return new Date().toISOString();
  }

  version(): string {
    return getPackageVersion();
  }
}
