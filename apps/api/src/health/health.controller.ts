import { Public } from "@/decorators/public.decorator";
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  TypeOrmHealthIndicator,
} from "@nestjs/terminus";

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Public()
  @Get("http")
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck("google", "https://google.com"),
    ]);
  }

  @Public()
  @Get("db")
  @HealthCheck()
  checkDb() {
    return this.health.check([() => this.db.pingCheck("database")]);
  }
}
