import { Injectable } from '@nestjs/common';
import { getPackageVersion } from './utils';

@Injectable()
export class AppService {
  ping(): string {
    return 'pong';
  }

  time(): string {
    return new Date().toISOString();
  }

  version(): string {
    return getPackageVersion();
  }
}
