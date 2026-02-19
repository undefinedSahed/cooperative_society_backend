// common/guards/user-or-admin.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserRole } from '../../user/user.schema';

@Injectable()
export class UserOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Type the request so we know exactly what user looks like
    const request = context.switchToHttp().getRequest<
      Request & {
        user?: { userId: string; phoneNumber: string; role: UserRole };
      }
    >();

    const { user } = request;
    const phoneNumberParam = request.params['phoneNumber'];

    if (!user) {
      throw new ForbiddenException('No user attached to request');
    }

    // Admin can access any user
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // A regular user can only access their own record
    if (user.phoneNumber === phoneNumberParam) {
      return true;
    }

    throw new ForbiddenException('Access denied');
  }
}
