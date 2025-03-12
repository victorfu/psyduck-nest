import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "@/decorators/public.decorator";
import { FirebaseAdminService } from "@/firebase-admin/firebase-admin.service";

@Injectable()
export class FirebaseGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private firebaseAdminService: FirebaseAdminService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    if (!token) {
      throw new UnauthorizedException();
    }
    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      throw new UnauthorizedException();
    }
    try {
      const idToken = tokenParts[1];
      const decodedToken =
        await this.firebaseAdminService.verifyIdToken(idToken);
      request.user = await this.firebaseAdminService.getUser(decodedToken.uid);
    } catch (error) {
      console.log("error", error);
      throw new UnauthorizedException();
    }

    return true;
  }
}
