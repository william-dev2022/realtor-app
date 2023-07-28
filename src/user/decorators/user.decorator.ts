import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export interface AuthUser {
  id: number;
  email: string;
}
export const User = createParamDecorator(
  (data, context: ExecutionContext): AuthUser => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  }
);
