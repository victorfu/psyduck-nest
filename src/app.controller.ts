import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  ping(): string {
    return this.appService.ping();
  }

  @Get('time')
  time(): string {
    return this.appService.time();
  }

  @Get('version')
  version(): string {
    return this.appService.version();
  }
}
