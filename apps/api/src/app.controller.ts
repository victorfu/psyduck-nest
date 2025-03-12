import { Controller, Get, Render } from "@nestjs/common";
import { AppService } from "./app.service";
import { Public } from "./decorators/public.decorator";
import { ApiExcludeEndpoint } from "@nestjs/swagger";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get("date")
  date() {
    return this.appService.date();
  }

  @Public()
  @Get("env")
  env() {
    return this.appService.env();
  }

  @Public()
  @Get("version")
  version() {
    return this.appService.version();
  }

  // Views

  @ApiExcludeEndpoint()
  @Public()
  @Get("ssr")
  @Render("ssr")
  ssr() {
    return { message: "Hello SSR!" };
  }
}
