import { UserRole } from 'src/user/user.schema';

export interface JwtPayload {
  phoneNumber: string;
  sub: string;
  role: UserRole;
}
