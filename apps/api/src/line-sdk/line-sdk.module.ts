import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { LineSdkController } from "./line-sdk.controller";
import { LineSdkService } from "./line-sdk.service";
import { FirebaseAdminModule } from "@/firebase-admin/firebase-admin.module";
import { LineConfigMiddleware } from "../middleware/line-config.middleware";

@Module({
  imports: [FirebaseAdminModule],
  controllers: [LineSdkController],
  providers: [LineSdkService],
  exports: [LineSdkService], // Export service to be used by other modules if needed
})
export class LineSdkModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LineConfigMiddleware).forRoutes({
      path: "line/webhook/:workspaceId",
      method: RequestMethod.POST,
    });
  }
}
