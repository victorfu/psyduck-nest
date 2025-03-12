import { Injectable, NestMiddleware, RawBodyRequest } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { LineSdkService } from "../line-sdk/line-sdk.service";

@Injectable()
export class LineConfigMiddleware implements NestMiddleware {
  constructor(private readonly lineSdkService: LineSdkService) {}

  async use(req: RawBodyRequest<Request>, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.params.workspaceId;
      const lineMiddleware =
        await this.lineSdkService.getMiddleware(workspaceId);
      await new Promise((resolve, reject) => {
        lineMiddleware(req, res, (err: any) => {
          if (err) reject(err);
          resolve(true);
        });
      });

      next();
    } catch (error) {
      console.error("LINE middleware error:", error);
      res.status(500).json({ error: "LINE middleware error" });
    }
  }
}
