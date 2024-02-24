import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  TypeOrmHealthIndicator,
} from "@nestjs/terminus";

@ApiTags("health")
@ApiBearerAuth()
@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get("http")
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck("google", "https://google.com"),
    ]);
  }

  @Get("db")
  @HealthCheck()
  checkDb() {
    return this.health.check([() => this.db.pingCheck("database")]);
  }
}
