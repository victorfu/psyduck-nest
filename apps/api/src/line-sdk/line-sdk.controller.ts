import {
  Controller,
  Get,
  Query,
  BadRequestException,
  Logger,
  Post,
  Param,
  Body,
  HttpCode,
} from "@nestjs/common";
import { LineSdkService } from "./line-sdk.service";
import { Public } from "@/decorators/public.decorator";

@Controller("line")
export class LineSdkController {
  private readonly logger = new Logger(LineSdkController.name);

  constructor(private readonly lineSdkService: LineSdkService) {}

  @Get("message-quota")
  async getLineMessageQuota(@Query("workspaceId") workspaceId: string) {
    try {
      return await this.lineSdkService.getMessageQuota(workspaceId);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }

  @Get("webhook-endpoint")
  async getLineWebhookEndpoint(@Query("workspaceId") workspaceId: string) {
    try {
      return await this.lineSdkService.getWebhookEndpoint(workspaceId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Post("webhook/:workspaceId")
  @HttpCode(200)
  lineWebhook(@Param("workspaceId") workspaceId: string, @Body() body: any) {
    if (!Array.isArray(body.events)) {
      throw new BadRequestException("Invalid body");
    }
    this.lineSdkService.handleEvents(workspaceId, body.events);
    return "OK";
  }
}
