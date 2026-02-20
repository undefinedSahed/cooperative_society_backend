import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

export const UserDecorator = createParamDecorator(
  (field: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: JwtPayload }>();

    if (!request.user) return undefined;

    return field ? request.user[field] : request.user;
  },
);
