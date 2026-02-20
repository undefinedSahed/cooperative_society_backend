import { UserRole } from 'src/user/user.schema';

export interface JwtPayload {
  phoneNumber: string;
  userId: string;
  role: UserRole;
}
