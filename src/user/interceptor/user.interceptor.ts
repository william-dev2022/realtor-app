import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UnauthorizedException
} from "@nestjs/common";
import {Observable} from "rxjs";
import * as jwt from "jsonwebtoken";

export class UserInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split(" ")[1];

    if (token) {
      const user = jwt.decode(token);
      try {
        jwt.verify(token, process.env.JSON_TOKEN_KEY);
        request.user = user;
      } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          throw new UnauthorizedException(error.message);
        } else if (error instanceof jwt.TokenExpiredError) {
          throw new BadRequestException(error.message);
        } else if (error instanceof jwt.NotBeforeError) {
          throw new BadRequestException(error.message);
        } else {
          throw new BadRequestException(error.message);
        }
      }
    }
    return next.handle();
  }
}
